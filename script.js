// Get DOM elements
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const resultDiv = document.getElementById('result');

// Define chemotherapy regimens
const CHEMO_REGIMENS = {
    'AC': {
        name: 'AC Regimen (Doxorubicin/Cyclophosphamide)',
        cycle_length: 21,
        premedications: {
            'Dexamethasone': '20mg PO/IV',
            'Ondansetron': '16mg PO/IV',
            'Aprepitant': '125mg PO day 1, then 80mg PO days 2-3',
            'Diphenhydramine': '25-50mg IV'
        },
        drugs: {
            'Doxorubicin': {
                dose: 60, // mg/m2
                route: 'IV Push',
                frequency: 'Day 1',
                preparation: 'No dilution required',
                administration: 'Slow IV push over 3-5 minutes',
                monitoring: '🫀 Monitor ECG if cumulative dose >400mg/m²',
                precautions: '⚠️ Red urine normal. Avoid extravasation.',
                hydration: 'Not required'
            },
            'Cyclophosphamide': {
                dose: 600, // mg/m2
                route: 'IV',
                frequency: 'Day 1',
                preparation: 'Dilute in 100-250ml NS or D5W',
                administration: 'Infuse over 30-60 minutes',
                monitoring: '🚽 Monitor fluid intake/output',
                precautions: '⚠️ Consider MESNA if dose >1000mg/m²',
                hydration: 'Encourage oral hydration'
            }
        },
        postMedications: {
            'Ondansetron': '8mg PO q8h PRN days 2-3',
            'Dexamethasone': '8mg PO BID days 2-4',
            'G-CSF': 'Consider if high risk for neutropenia'
        },
        supportiveCare: [
            '🤢 Antiemetics essential - High emetogenic risk',
            '🌡️ Monitor CBC weekly',
            '💊 Consider antacid prophylaxis',
            '❤️ Baseline ECHO required'
        ]
    },
    'TCHP': {
        name: 'TCHP Regimen (Docetaxel/Carboplatin/Herceptin/Perjeta)',
        cycle_length: 21,
        premedications: {
            'Dexamethasone': '8mg BID for 3 days, starting day before chemo',
            'Diphenhydramine': '50mg IV',
            'Famotidine': '20mg IV',
            'Ondansetron': '8mg IV'
        },
        drugs: {
            'Pertuzumab': {
                dose: 420,
                route: 'IV',
                frequency: 'Day 1',
                preparation: 'Dilute in 250ml NS',
                administration: 'Initial dose over 60 mins, then 30 mins if tolerated',
                monitoring: '🫀 Monitor vitals during infusion',
                precautions: '⚠️ Observe for infusion reactions',
                hydration: 'Standard hydration'
            },
            'Trastuzumab': {
                dose: 6,
                route: 'IV',
                frequency: 'Day 1',
                preparation: 'Dilute in 250ml NS',
                administration: 'Initial dose over 90 mins, then 30 mins if tolerated',
                monitoring: '🫀 Monitor cardiac function',
                precautions: '⚠️ Check LVEF every 3 months',
                hydration: 'Standard hydration'
            },
            'Docetaxel': {
                dose: 75,
                route: 'IV',
                frequency: 'Day 1',
                preparation: 'Dilute in 250ml NS',
                administration: 'Infuse over 60 minutes',
                monitoring: '👀 Monitor for hypersensitivity',
                precautions: '⚠️ Premedicate with steroids',
                hydration: 'Standard hydration'
            },
            'Carboplatin': {
                dose: 6,
                route: 'IV',
                frequency: 'Day 1',
                preparation: 'Dilute in 250ml D5W or NS',
                administration: 'Infuse over 30 minutes',
                monitoring: '🌡️ Monitor CBC, platelets',
                precautions: '⚠️ Calculate AUC based on GFR',
                hydration: 'Standard hydration'
            }
        },
        postMedications: {
            'Ondansetron': '8mg PO q8h PRN for 3 days',
            'G-CSF': 'As per protocol',
            'Dexamethasone': 'Continue for 2 more days'
        },
        supportiveCare: [
            '❤️ Regular cardiac monitoring',
            '🌡️ Monitor CBC weekly',
            '🦷 Good oral hygiene',
            '🧴 Skin care for nail/skin toxicity'
        ]
    },
    'FOLFOX': {
        name: 'FOLFOX Regimen (5-FU/Leucovorin/Oxaliplatin)',
        cycle_length: 14,
        premedications: {
            'Dexamethasone': '12mg IV',
            'Ondansetron': '8mg IV',
            'Diphenhydramine': '25mg IV',
            'Famotidine': '20mg IV'
        },
        drugs: {
            'Oxaliplatin': {
                dose: 85,
                route: 'IV',
                frequency: 'Day 1',
                preparation: 'Dilute in 250-500ml D5W only (NO SALINE)',
                administration: 'Infuse over 2 hours',
                monitoring: '🥶 Monitor for cold sensitivity',
                precautions: '⚠️ Avoid cold food/drinks for 5 days',
                hydration: 'Standard hydration'
            },
            'Leucovorin': {
                dose: 400,
                route: 'IV',
                frequency: 'Day 1',
                preparation: 'Dilute in 250ml D5W or NS',
                administration: 'Infuse over 2 hours (concurrent with oxaliplatin)',
                monitoring: 'Routine',
                precautions: 'Compatible with oxaliplatin',
                hydration: 'Not required'
            },
            '5-FU Bolus': {
                dose: 400,
                route: 'IV Push',
                frequency: 'Day 1',
                preparation: 'No dilution required',
                administration: 'IV push over 2-4 minutes',
                monitoring: '👄 Monitor for mucositis',
                precautions: '⚠️ Check DPD status before first dose',
                hydration: 'Not required'
            },
            '5-FU Infusion': {
                dose: 2400,
                route: 'Continuous IV',
                frequency: 'Over 46 hours',
                preparation: 'Dilute in pump reservoir',
                administration: '46-hour continuous infusion via pump',
                monitoring: '🌡️ Monitor for neutropenia',
                precautions: '⚠️ Patient education on pump care',
                hydration: 'Maintain good oral hydration'
            }
        },
        postMedications: {
            'Ondansetron': '8mg PO q8h PRN days 2-3',
            'Dexamethasone': '4mg PO BID PRN days 2-3'
        },
        supportiveCare: [
            '🧤 Cold sensitivity precautions for 5 days',
            '🌡️ Monitor CBC weekly',
            '👄 Oral cryotherapy during bolus 5-FU',
            '💊 Consider vitamin B6 for hand-foot syndrome'
        ]
    },
    'CMF': {
        name: 'CMF Regimen (Cyclophosphamide/Methotrexate/5-FU)',
        cycle_length: 21,
        premedications: {
            'Ondansetron': '8mg IV',
            'Dexamethasone': '8mg IV'
        },
        drugs: {
            'Cyclophosphamide': {
                dose: 600,
                route: 'IV',
                frequency: 'Day 1',
                preparation: 'Dilute in 100-250ml NS',
                administration: 'Infuse over 30 minutes',
                monitoring: '🚽 Monitor fluid intake/output',
                precautions: '⚠️ Encourage fluid intake',
                hydration: 'Oral hydration important'
            },
            'Methotrexate': {
                dose: 40,
                route: 'IV',
                frequency: 'Day 1',
                preparation: 'Dilute in 50-100ml NS',
                administration: 'Infuse over 15 minutes',
                monitoring: '🌡️ Monitor CBC, LFTs',
                precautions: '⚠️ Check creatinine before each dose',
                hydration: 'Standard hydration'
            },
            '5-Fluorouracil': {
                dose: 600,
                route: 'IV Push',
                frequency: 'Day 1',
                preparation: 'No dilution required',
                administration: 'Slow IV push over 5 minutes',
                monitoring: '👄 Monitor for mucositis',
                precautions: '⚠️ Check DPD status',
                hydration: 'Not required'
            }
        },
        postMedications: {
            'Ondansetron': '8mg PO PRN',
            'Metoclopramide': '10mg PO PRN'
        },
        supportiveCare: [
            '🌡️ Weekly CBC monitoring',
            '💊 Antiemetics as needed',
            '👄 Oral care important',
            '🦠 Monitor for signs of infection'
        ]
    }
};

function calculateBSA() {
    // Get input values
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);

    // Validate inputs
    if (!isValidInput(weight, height)) {
        return;
    }

    // Calculate BSA using different formulas
    const bsaDubois = calculateDubois(weight, height);
    const bsaMosteller = calculateMosteller(weight, height);

    // Display results
    displayResults(bsaDubois, bsaMosteller);
}

function isValidInput(weight, height) {
    if (!weight || !height || weight <= 0 || height <= 0) {
        resultDiv.innerHTML = `
            <p class="error">⚠️ Please enter valid positive numbers for weight and height.</p>
        `;
        return false;
    }
    
    // Warning for extreme values
    if (weight < 20 || weight > 200) {
        resultDiv.innerHTML += `
            <p class="warning">Warning: Weight value seems unusual. Please verify.</p>
        `;
    }
    if (height < 100 || height > 250) {
        resultDiv.innerHTML += `
            <p class="warning">Warning: Height value seems unusual. Please verify.</p>
        `;
    }
    
    return true;
}

function calculateDubois(weight, height) {
    // DuBois formula: BSA = 0.007184 × weight^0.425 × height^0.725
    return 0.007184 * Math.pow(weight, 0.425) * Math.pow(height, 0.725);
}

function calculateMosteller(weight, height) {
    // Mosteller formula: BSA = √(height × weight / 3600)
    return Math.sqrt((height * weight) / 3600);
}

function displayDrugDetails(drug, details) {
    return `
        <div class="drug-details">
            <h4>💊 ${drug}</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>Dose:</strong> ${details.dose} mg/m²
                </div>
                <div class="detail-item">
                    <strong>Route:</strong> ${details.route}
                </div>
                <div class="detail-item">
                    <strong>Schedule:</strong> ${details.frequency}
                </div>
                <div class="detail-item">
                    <strong>Preparation:</strong> ${details.preparation}
                </div>
                <div class="detail-item">
                    <strong>Administration:</strong> ${details.administration}
                </div>
                <div class="detail-item">
                    <strong>Monitoring:</strong> ${details.monitoring}
                </div>
                <div class="detail-item">
                    <strong>Precautions:</strong> ${details.precautions}
                </div>
            </div>
        </div>
    `;
}

function calculateDoses(bsa) {
    const regimenSelect = document.getElementById('regimen');
    const selectedRegimen = regimenSelect.value;
    const dosesDiv = document.getElementById('doses');

    if (!selectedRegimen) {
        dosesDiv.innerHTML = '<p class="warning">⚠️ Please select a chemotherapy regimen.</p>';
        return;
    }

    const regimen = CHEMO_REGIMENS[selectedRegimen];
    
    let dosesHtml = `
        <div class="doses-container">
            <h3 class="regimen-title">💉 ${regimen.name}</h3>
            <div class="cycle-info">
                <p>⏱️ Cycle length: ${regimen.cycle_length} days</p>
            </div>
            
            <div class="sequence-container">
                <div class="sequence-step">
                    <h4 class="step-title">
                        <span class="step-number">1</span>
                        🏥 Pre-medications
                        <span class="arrow">⬇️</span>
                    </h4>
                    <div class="step-content">
                        <ul class="medication-list">
                            ${Object.entries(regimen.premedications).map(([med, dose], index) => `
                                <li>
                                    <span class="med-number">${index + 1}.</span>
                                    <span class="med-name">${med}:</span>
                                    <span class="med-dose">${dose}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>

                <div class="sequence-step">
                    <h4 class="step-title">
                        <span class="step-number">2</span>
                        💊 Chemotherapy Administration
                        <span class="arrow">⬇️</span>
                    </h4>
                    <div class="step-content">
                        <table class="doses-table">
                            <thead>
                                <tr>
                                    <th>Drug</th>
                                    <th>Dose/m²</th>
                                    <th>Calculated Dose</th>
                                    <th>Route</th>
                                    <th>Schedule</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Object.entries(regimen.drugs).map(([drug, details]) => `
                                    <tr>
                                        <td>${drug}</td>
                                        <td>${details.dose} mg/m²</td>
                                        <td>${(details.dose * bsa).toFixed(1)} mg</td>
                                        <td>${details.route}</td>
                                        <td>${details.frequency}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>

                        ${Object.entries(regimen.drugs).map(([drug, details], index) => `
                            <div class="admin-details">
                                <h5>
                                    <span class="med-number">${index + 1}.</span>
                                    ${drug} Administration:
                                </h5>
                                <ul class="admin-list">
                                    <li>💉 <strong>Preparation:</strong> ${details.preparation}</li>
                                    <li>⏱️ <strong>Administration:</strong> ${details.administration}</li>
                                    <li>👀 <strong>Monitoring:</strong> ${details.monitoring}</li>
                                    <li>⚠️ <strong>Precautions:</strong> ${details.precautions}</li>
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="sequence-step">
                    <h4 class="step-title">
                        <span class="step-number">3</span>
                        💊 Post-medications
                        <span class="arrow">⬇️</span>
                    </h4>
                    <div class="step-content">
                        <ul class="medication-list">
                            ${Object.entries(regimen.postMedications).map(([med, dose], index) => `
                                <li>
                                    <span class="med-number">${index + 1}.</span>
                                    <span class="med-name">${med}:</span>
                                    <span class="med-dose">${dose}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>

                <div class="sequence-step">
                    <h4 class="step-title">
                        <span class="step-number">4</span>
                        📝 Supportive Care Measures
                    </h4>
                    <div class="step-content">
                        <ul class="supportive-care-list">
                            ${regimen.supportiveCare.map((care, index) => `
                                <li>
                                    <span class="med-number">${index + 1}.</span>
                                    ${care}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>

            <div class="warning-box">
                ⚠️ Note: These calculations are for reference only. 
                Please verify all doses and consult current guidelines and protocols.
            </div>
        </div>
    `;

    dosesDiv.innerHTML = dosesHtml;
}

// Modify your existing displayResults function to include dose calculations
function displayResults(bsaDubois, bsaMosteller) {
    resultDiv.innerHTML = `
        <h3>📊 Body Surface Area Results:</h3>
        <div class="result-item">
            <p>🔵 DuBois Formula: <strong>${bsaDubois.toFixed(2)} m²</strong></p>
            <small>Most commonly used in clinical practice</small>
        </div>
        <div class="result-item">
            <p>🔵 Mosteller Formula: <strong>${bsaMosteller.toFixed(2)} m²</strong></p>
            <small>Simpler calculation, similar accuracy</small>
        </div>
        <div class="dosing-note">
            <p><em>📝 Note: Always verify calculations and consult current guidelines for specific dosing recommendations.</em></p>
        </div>
    `;
    
    // Calculate doses
    calculateDoses(bsaDubois);
}

// Optional: Add unit conversion functions
function convertPoundsToKg(pounds) {
    return pounds * 0.45359237;
}

function convertInchesToCm(inches) {
    return inches * 2.54;
}

// Event listeners
weightInput.addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
    clearResults();
});

heightInput.addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
    clearResults();
});

document.getElementById('regimen').addEventListener('change', clearResults);

function clearResults() {
    document.getElementById('result').innerHTML = '';
    document.getElementById('doses').innerHTML = '';
}
