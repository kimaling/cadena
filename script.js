const skills = {
    BuffSkills: {
        "그란디스 여신의 축복": 240,
        "프로페셔널 에이전트": 180,
        "체인아츠:퓨리": 180,
        "상인단 특제 비약": 120,
        "레디 투 다이": 75,
        "소울 컨트랙트(리마스터)": 60,
    },
    AttackSkills: {
        "체인아츠:매서커": 360,
        "체인아츠:테이크다운": 120,
        "체인아츠:테이크다운쿨감": 96,
        "체인아츠:크러시": 30,
        "A.D 오드넌스": 25,
        "서먼 비팅 니들배트": 12,
        "서먼 스로잉 윙대거": 10,
        "서먼 슬래싱 나이프": 10,
        "서먼 스트라이킹 브릭": 8,
        "서먼 릴리싱 봄": 8,
    },
    UtilitySkills: {
        "에르다의 의지": 330,
        "용사의 의지": 300,
        "체인아츠:터프허슬": 45,
        "블링크": 20
    }
};

function calculateCooldownForSkill(originalCooldown, mercedesEffect, hatPotential) {
    if (originalCooldown < 5) {
        return originalCooldown;
    }

    let cooldownAfterMercedes = originalCooldown * (1 - mercedesEffect);

    // Apply flat cooldown reduction if applicable
    if (cooldownAfterMercedes > 10) {
        let possibleFlatReduction = Math.min(hatPotential, cooldownAfterMercedes - 10);
        cooldownAfterMercedes -= possibleFlatReduction;
        hatPotential -= possibleFlatReduction;
    }

    // Apply ratio cooldown reduction if applicable
    if (hatPotential > 0) {
        let ratioReduction = hatPotential * 0.05;
        cooldownAfterMercedes *= (1 - ratioReduction);
    }

    return Math.max(5, cooldownAfterMercedes);
}

function skillNameToIconFileName(skillName) {
    let iconName = skillName;

    // Only do replacements if the skill name contains a colon
    if (skillName.includes(':')) {
        iconName = skillName.replace(/:/g, '').replace(/ /g, '_');
    }

    return iconName + '.png';
}

function populateTable() {
    const mercedesEffect = parseFloat(document.getElementById('mercedesEffect').value);
    const categoryTableMapping = {
        'BuffSkills': 'buffSkillTable',
        'AttackSkills': 'attackSkillTable',
        'UtilitySkills': 'utilitySkillTable'
    };

    for (let category in categoryTableMapping) {
        const tableElement = document.getElementById(categoryTableMapping[category]);

        if (tableElement) {
            const tableBody = tableElement.getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear

            for (let skill in skills[category]) {
                let row = tableBody.insertRow();
                let cell = row.insertCell(0);

                // Create a span element for the skill name
                let nameElement = document.createElement('span');
                nameElement.textContent = skill;
                nameElement.classList.add('skill-name');

                // Create an image element for the skill icon
                let iconElement = document.createElement('img');
                iconElement.src = `icons/${skillNameToIconFileName(skill)}`; // use the utility function here
                iconElement.classList.add('skill-icon');

                cell.appendChild(iconElement);


                cell = row.insertCell(1);
                cell.innerHTML = skills[category][skill];

                for (let i = 0; i <= 9; i++) {
                    let cd = calculateCooldownForSkill(skills[category][skill], mercedesEffect, i);
                    cell = row.insertCell(i + 2);
                    cell.innerHTML = cd.toFixed(2);

                }
            }
        }
    }
}

function populateAnalysisTable() {
    const scenario1MercedesEffect = parseFloat(document.getElementById('scenario1MercedesEffect').value);
    const scenario2MercedesEffect = parseFloat(document.getElementById('scenario2MercedesEffect').value);

    const scenario1HatPot = parseInt(document.getElementById('scenario1HatPot').value);
    const scenario2HatPot = parseInt(document.getElementById('scenario2HatPot').value);

    const categoryTableMapping = {
        'BuffSkills': 'analysisBuffSkillTable',
        'AttackSkills': 'analysisAttackSkillTable',
        'UtilitySkills': 'analysisUtilitySkillTable'
    };

    for (let category in categoryTableMapping) {
        const analysisTable = document.getElementById(categoryTableMapping[category]).getElementsByTagName('tbody')[0];
        analysisTable.innerHTML = ''; // Clear existing rows

        for (let skill in skills[category]) {
            const cooldownScenario1 = calculateCooldownForSkill(skills[category][skill], scenario1MercedesEffect, scenario1HatPot);
            const cooldownScenario2 = calculateCooldownForSkill(skills[category][skill], scenario2MercedesEffect, scenario2HatPot);

            const differencePercent = ((cooldownScenario2 - cooldownScenario1) / cooldownScenario1) * 100;
            const absoluteDifference = cooldownScenario2 - cooldownScenario1;

            let row = analysisTable.insertRow();

            let cell = row.insertCell(0);

            // Create an image element for the skill icon
            let iconElement = document.createElement('img');
            iconElement.src = `icons/${skillNameToIconFileName(skill)}`; // use the utility function here
            iconElement.classList.add('skill-icon');

            // Create a span element for the skill name
            let nameElement = document.createElement('span');
            nameElement.textContent = skill;
            nameElement.classList.add('skill-name');

            // Append both elements to the cell
            cell.appendChild(iconElement);

            cell = row.insertCell(1);
            cell.innerHTML = cooldownScenario1.toFixed(2);

            cell = row.insertCell(2);
            cell.innerHTML = cooldownScenario2.toFixed(2);

            cell = row.insertCell(3);
            cell.innerHTML = absoluteDifference.toFixed(2) + '초';

            cell = row.insertCell(4);
            cell.innerHTML = differencePercent.toFixed(2) + '%';
        }
    }
}

/**
 * Event Handlers
 */

function toggleDarkMode() {
    if (document.body.getAttribute('data-theme') === 'dark') {
        document.body.setAttribute('data-theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialization code
    document.getElementById('scenario1MercedesEffect').value = "0.05";
    document.getElementById('scenario2MercedesEffect').value = "0.06";
    document.getElementById('scenario1HatPot').value = "2";
    document.getElementById('scenario2HatPot').value = "5";

    // Populate tables
    populateTable();
    populateAnalysisTable();

    // Handle Dark Mode Preference
    const darkModeCheckbox = document.getElementById('darkModeCheckbox');

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        darkModeCheckbox.checked = true;
        document.body.setAttribute('data-theme', 'dark');
    }

    darkModeCheckbox.addEventListener('change', toggleDarkMode);
});


document.querySelectorAll('table').forEach(table => {
    table.addEventListener('mouseover', function(e) {
        let td = e.target.closest('td');
        if (!td) return;
        let tr = td.parentNode;
        let index = [...tr.children].indexOf(td);

        if (index <= 0) return;

        table.querySelectorAll('td, th').forEach(cell => cell.classList.remove('highlight-col'));
        table.querySelectorAll('tr').forEach(row => {
            if (row.children[index]) row.children[index].classList.add('highlight-col');
        });

        table.querySelectorAll('tr').forEach(row => row.classList.remove('highlight-row'));
        tr.classList.add('highlight-row');
    });

    table.addEventListener('mouseout', function() {
        table.querySelectorAll('td, th').forEach(cell => cell.classList.remove('highlight-col'));
        table.querySelectorAll('tr').forEach(row => row.classList.remove('highlight-row'));
    });
});

populateTable();
