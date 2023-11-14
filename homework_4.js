const names = ["Jozef", "Peter", "Martin", "Marek", "Michal",
"Pavel", "Jan", "Lukáš", "Roman", "Tomáš",
"Jakub", "Vladimír", "František", "Jiří", "Radoslav",
"Václav", "Zdeněk", "Karel", "Stanislav", "Josef",
"Ondřej", "Milan", "Daniel", "Patrik", "Filip",
"Dušan", "Ivan", "Emil", "Ladislav", "David",
"Andrej", "Miroslav", "Jaroslav", "Luboš", "Radomír",
"Vít", "Bohumil", "Dalibor", "Eduard", "Gustav",
"Hynek", "Igor", "Jaromír", "Kamil", "Leoš",
"Marian", "Norbert", "Oldřich", "Petr", "Radovan", "Anna", 
"Jana", "Martina", "Eva", "Michaela",
"Pavla", "Lucie", "Tereza", "Barbora", "Veronika",
"Lenka", "Klára", "Petra", "Monika", "Alena",
"Simona", "Helena", "Iva", "Kristýna", "Hana",
"Jitka", "Nikola", "Renata", "Karolína", "Denisa",
"Dana", "Ludmila", "Libuše", "Vlasta", "Růžena",
"Milena", "Božena", "Dagmar", "Edita", "Gabriela",
"Irena", "Jarmila", "Květa", "Lada", "Magdaléna",
"Naděžda", "Olga", "Pavlína", "Radka", "Šárka",
"Tatiana", "Věra", "Zdenka", "Zuzana", "Agáta"];

const surnames = ["Novák", "Svoboda", "Novotný", "Dvořák", "Černý",
"Procházka", "Kučera", "Veselý", "Horák", "Němec",
"Marek", "Pospíšil", "Hrubý", "Král", "Janda",
"Bartoš", "Holub", "Kříž", "Jelínek", "Růžička",
"Beneš", "Fiala", "Sedláček", "Doležal", "Zeman",
"Kolář", "Navrátil", "Čermák", "Urban", "Vaněk",
"Polák", "Kopecký", "Konečný", "Malý", "Holý",
"Bláha", "Hájek", "Jirka", "Krejčí", "Krátký",
"Šimánek", "Kadlec", "Soukup", "Šimek", "Pešek",
"Matoušek", "Pavlík", "Vlček", "Kubík", "Richter"];

const genders = ['male', 'female'];
const workloads = [10, 20, 30, 40];

function isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBirthdate(ageMin, ageMax) {
    const currentYear = new Date().getFullYear();
    const year = randomInt(currentYear - ageMax, currentYear - ageMin);
    const month = randomInt(1, 12);
    let day;

    if (month === 2) {
        day = isLeapYear(year) ? randomInt(1, 29) : randomInt(1, 28);
    } else if ([4, 6, 9, 11].includes(month)) {
        day = randomInt(1, 30);
    } else {
        day = randomInt(1, 31);
    }

    const birthdate = new Date(year, month - 1, day);
    return birthdate.toISOString();
}

function randomEmployee(ageMin, ageMax) {

    return {
        name: names[randomInt(0, names.length - 1)],
        surname: surnames[randomInt(0, surnames.length - 1)],
        gender: genders[randomInt(0, genders.length - 1)],
        birthdate: randomBirthdate(ageMin, ageMax),
        workload: workloads[randomInt(0, workloads.length - 1)]
    };
}

function calculateAverageAge(employees) {
    const totalAge = employees.reduce((sum, e) => sum + (new Date().getFullYear() - new Date(e.birthdate).getFullYear()), 0);
    return parseFloat((totalAge / employees.length).toFixed(1));
}

function findMinMaxAge(employees) {
    const ages = employees.map(e => new Date().getFullYear() - new Date(e.birthdate).getFullYear());
    return {
        min: Math.min(...ages),
        max: Math.max(...ages)
    };
}

function calculateMedian(values) {
    const sorted = values.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
}

function calculateAverageWorkloadForWomen(employees) {
    const women = employees.filter(e => e.gender === 'female');
    const totalWorkload = women.reduce((sum, w) => sum + w.workload, 0);
    return women.length ? totalWorkload / women.length : 0;
}

function sortEmployeesByWorkload(employees) {
    return employees.slice().sort((a, b) => a.workload - b.workload);
}

function getEmployeeStatistics(employees) {
    const workloads = employees.reduce((acc, e) => {
        acc[e.workload] = (acc[e.workload] || 0) + 1;
        return acc;
    }, {});

    const ages = employees.map(e => new Date().getFullYear() - new Date(e.birthdate).getFullYear());
    const workloadsArray = employees.map(e => e.workload);

    return {
        total: employees.length,
        workload10: workloads[10] || 0,
        workload20: workloads[20] || 0,
        workload30: workloads[30] || 0,
        workload40: workloads[40] || 0,
        averageAge: calculateAverageAge(employees),
        minAge: findMinMaxAge(employees).min,
        maxAge: findMinMaxAge(employees).max,
        medianAge: calculateMedian(ages),
        medianWorkload: calculateMedian(workloadsArray),
        averageWomenWorkload: calculateAverageWorkloadForWomen(employees),
        sortedByWorkload: sortEmployeesByWorkload(employees)
    };
}

function main(dtoIn) {
    const employees = [];
    for (let i = 0; i < dtoIn.count; i++) {
        employees.push(randomEmployee(dtoIn.age.min, dtoIn.age.max));
    }

    const statistics = getEmployeeStatistics(employees);
    const dtoOut = { ...statistics };

    return dtoOut;
}

const dtoIn = {
    count: 2,
    age: {
        min: 19,
        max: 35
    }
};

const dtoOut = main(dtoIn);
console.log(dtoOut);
