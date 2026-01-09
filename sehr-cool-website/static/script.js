document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       1. ANIMATION OBSERVER (RESET LOGIC)
    ========================= */
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            } else {
                entry.target.classList.remove("active");
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(el => observer.observe(el));


    /* =========================
       2. DISEASE DATABASE (Full List)
    ========================= */
    const diseaseDatabase = {
        // --- AUTOSOMAL RECESSIVE ---
        "Cystic Fibrosis": {
            inheritance: "Autosomal Recessive",
            features: ["Mutation in CFTR gene affecting salt/water balance", "Buildup of thick, sticky mucus in organs"],
            symptoms: ["Persistent cough", "Lung infections", "Salty-tasting skin", "Poor growth"]
        },
        "Sickle Cell Anemia": {
            inheritance: "Autosomal Recessive",
            features: ["Abnormal hemoglobin causes sickle-shaped red blood cells", "Blockage of blood flow causing pain"],
            symptoms: ["Chronic anemia", "Pain crises", "Fatigue", "Swelling of hands/feet"]
        },
        "Thalassemia": {
            inheritance: "Autosomal Recessive",
            features: ["Reduced production of hemoglobin", "Destruction of red blood cells"],
            symptoms: ["Pale skin", "Weakness", "Bone deformities", "Dark urine"]
        },
        "Tay-Sachs Disease": {
            inheritance: "Autosomal Recessive",
            features: ["Absence of enzyme Hex-A", "Accumulation of lipids in the brain"],
            symptoms: ["Loss of motor skills", "Seizures", "Cherry-red spot in eye", "Muscle weakness"]
        },
        "Phenylketonuria (PKU)": {
            inheritance: "Autosomal Recessive",
            features: ["Inability to break down amino acid phenylalanine", "Requires strict dietary management"],
            symptoms: ["Musty odor in breath", "Skin rashes (eczema)", "Developmental delays"]
        },
        "Spinal Muscular Atrophy": {
            inheritance: "Autosomal Recessive",
            features: ["Loss of motor neurons in spinal cord", "Muscle wasting due to SMN1 gene mutation"],
            symptoms: ["Muscle weakness", "Difficulty swallowing", "Respiratory issues"]
        },
        "Galactosemia": {
            inheritance: "Autosomal Recessive",
            features: ["Inability to process galactose (sugar in milk)", "Toxic accumulation causing organ damage"],
            symptoms: ["Jaundice", "Vomiting", "Poor weight gain", "Lethargy"]
        },
        "Wilson's Disease": {
            inheritance: "Autosomal Recessive",
            features: ["Accumulation of copper in liver and brain", "Defect in copper transport"],
            symptoms: ["Tremors", "Difficulty speaking", "Abdominal pain", "Golden-brown eye ring"]
        },
        "Gilbert Syndrome": {
            inheritance: "Autosomal Recessive",
            features: ["Liver doesn't process bilirubin properly", "Usually a mild condition"],
            symptoms: ["Mild jaundice (yellowing of eyes)", "Fatigue", "Abdominal discomfort"]
        },

        // --- AUTOSOMAL DOMINANT ---
        "Huntington Disease": {
            inheritance: "Autosomal Dominant",
            features: ["Progressive breakdown of nerve cells in the brain", "Onset typically in 30s or 40s"],
            symptoms: ["Chorea (involuntary movements)", "Cognitive decline", "Mood swings"]
        },
        "Marfan Syndrome": {
            inheritance: "Autosomal Dominant",
            features: ["Connective tissue disorder affecting heart, eyes, skeleton", "Mutation in FBN1 gene"],
            symptoms: ["Tall and thin build", "Long arms/fingers", "Heart murmurs", "Curved spine"]
        },
        "Achondroplasia": {
            inheritance: "Autosomal Dominant",
            features: ["Most common form of dwarfism", "Problem with converting cartilage to bone"],
            symptoms: ["Short stature", "Shortened limbs", "Large head size", "Normal intelligence"]
        },
        "Neurofibromatosis Type 1": {
            inheritance: "Autosomal Dominant",
            features: ["Changes in skin coloring", "Growth of tumors along nerves"],
            symptoms: ["Café-au-lait spots", "Soft bumps on or under skin", "Bone deformities"]
        },
        "ADPKD": {
            inheritance: "Autosomal Dominant",
            features: ["Clusters of cysts develop in kidneys", "Kidneys enlarge and lose function"],
            symptoms: ["High blood pressure", "Back or side pain", "Headaches", "Kidney stones"]
        },
        "Familial Hypercholesterolemia": {
            inheritance: "Autosomal Dominant",
            features: ["Body unable to remove LDL (bad) cholesterol", "High risk of early heart disease"],
            symptoms: ["Chest pain", "Fatty deposits around eyes/tendons", "Sudden stroke/heart attack"]
        },

        // --- X-LINKED RECESSIVE ---
        "Hemophilia": {
            inheritance: "X-Linked Recessive",
            features: ["Blood fails to clot normally", "Deficiency in clotting factor VIII or IX"],
            symptoms: ["Excessive bleeding from cuts", "Large or deep bruises", "Joint pain/swelling"]
        },
        "Color Blindness": {
            inheritance: "X-Linked Recessive",
            features: ["Difficulty distinguishing certain colors (Red-Green)", "Cone cells in retina are deficient"],
            symptoms: ["Inability to see shades of red and green", "Eye strain"]
        },
        "Duchenne Muscular Dystrophy": {
            inheritance: "X-Linked Recessive",
            features: ["Lack of dystrophin protein", "Rapid progressive muscle degeneration"],
            symptoms: ["Frequent falls", "Trouble running/jumping", "Large calf muscles", "Learning disabilities"]
        },
        "Becker Muscular Dystrophy": {
            inheritance: "X-Linked Recessive",
            features: ["Similar to Duchenne but milder", "Partial function of dystrophin protein"],
            symptoms: ["Muscle weakness (hips/pelvis)", "Walking on toes", "Muscle cramps"]
        },
        "G6PD Deficiency": {
            inheritance: "X-Linked Recessive",
            features: ["Red blood cells break down when exposed to triggers", "Enzyme deficiency"],
            symptoms: ["Paleness", "Jaundice", "Dark urine", "Fatigue"]
        },

        // --- X-LINKED DOMINANT ---
        "Rett Syndrome": {
            inheritance: "X-Linked Dominant",
            features: ["Rare genetic neurological disorder", "Affects mostly females (lethal in males)"],
            symptoms: ["Loss of hand movements", "Loss of speech", "Balance issues", "Breathing problems"]
        },
        "Fragile X Syndrome": {
            inheritance: "X-Linked Dominant",
            features: ["Mutation in FMR1 gene", "Most common cause of inherited intellectual disability"],
            symptoms: ["Learning disabilities", "Social anxiety", "Long face", "Large ears"]
        },
        "Hypophosphatemic Rickets": {
            inheritance: "X-Linked Dominant",
            features: ["Kidneys waste phosphorus", "Bones become soft and bend"],
            symptoms: ["Bowed legs", "Bone pain", "Short stature", "Dental abscesses"]
        },

        // --- MITOCHONDRIAL ---
        "Leber's Hereditary Optic Neuropathy": {
            inheritance: "Mitochondrial",
            features: ["Maternally inherited", "Death of cells in the optic nerve"],
            symptoms: ["Sudden vision loss", "Blurring of central vision", "Tremors"]
        },
        "MELAS Syndrome": {
            inheritance: "Mitochondrial",
            features: ["Mitochondrial Encephalomyopathy", "Lactic Acidosis and Stroke-like episodes"],
            symptoms: ["Muscle weakness", "Recurrent headaches", "Seizures", "Vomiting"]
        },
        "MERRF Syndrome": {
            inheritance: "Mitochondrial",
            features: ["Myoclonic Epilepsy with Ragged Red Fibers", "Defect in mitochondrial DNA"],
            symptoms: ["Muscle twitches", "Seizures", "Coordination problems", "Hearing loss"]
        }
    };


    /* =========================
       3. SELECTION LOGIC (Auto-Scroll)
    ========================= */
    const diseaseSelect = document.querySelector(".main-select");
    const overviewSection = document.getElementById("diseaseOverview");
    const diseaseTitle = document.getElementById("diseaseTitle");
    const inheritanceTag = document.getElementById("inheritanceTag");
    const featuresList = document.getElementById("featuresList");
    const symptomsList = document.getElementById("symptomsList");

    if (diseaseSelect) {
        diseaseSelect.addEventListener("change", (e) => {
            const selectedDisease = e.target.value;
            const data = diseaseDatabase[selectedDisease];

            if (data) {
                diseaseTitle.textContent = selectedDisease;
                inheritanceTag.textContent = data.inheritance;
                
                featuresList.innerHTML = "";
                data.features.forEach(f => {
                    const li = document.createElement("li");
                    li.textContent = f;
                    featuresList.appendChild(li);
                });

                symptomsList.innerHTML = "";
                data.symptoms.forEach(s => {
                    const li = document.createElement("li");
                    li.textContent = s;
                    symptomsList.appendChild(li);
                });

                overviewSection.classList.remove("hidden-section");
                
                overviewSection.classList.remove("active-overview");
                void overviewSection.offsetWidth; 
                overviewSection.classList.add("active-overview");

                overviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }


    /* =========================
       4. CONDITIONAL CARRIER LOGIC
    ========================= */
    document.addEventListener("change", (e) => {
        const statusSelect = e.target;
        if (!statusSelect.matches("select[data-status]")) return;

        const personCard = statusSelect.closest(".person-card");
        if (!personCard) return;

        const conditionalBlock = personCard.querySelector(".conditional");
        const carrierSelect = conditionalBlock ? conditionalBlock.querySelector("select") : null;

        if (!conditionalBlock || !carrierSelect) return;

        const statusValue = statusSelect.value;

        if (statusValue === "Non-affected") {
            conditionalBlock.classList.remove("hidden");
        } else {
            conditionalBlock.classList.add("hidden");
            if (statusValue === "Affected") carrierSelect.value = "Yes";
            else if (statusValue === "Unknown") carrierSelect.value = "Unknown";
        }
    });

});

/* =========================
   5. CALCULATE RISK BUTTON - READS ACTUAL FORM VALUES
========================= */
document.getElementById("calculateBtn").addEventListener("click", () => {
    // Helper function to get person data from a card
    function getPersonData(personCard, defaultSex) {
        const statusSelect = personCard.querySelector("select[data-status]");
        const carrierSelect = personCard.querySelector(".conditional select");
        
        const status = statusSelect.value;
        const affected = status === "Affected";
        
        let carrier_status = "unknown";
        if (status === "Affected") {
            carrier_status = "known_carrier";
        } else if (status === "Non-affected" && carrierSelect) {
            const carrierValue = carrierSelect.value;
            if (carrierValue === "Yes") carrier_status = "known_carrier";
            else if (carrierValue === "No") carrier_status = "known_non_carrier";
            else carrier_status = "unknown";
        }
        
        return {
            sex: defaultSex,
            affected: affected,
            carrier_status: carrier_status
        };
    }
    
    // Get all person cards in order
    const grandparentCards = document.querySelectorAll(".side-by-side .notebook:first-child .person-card");
    const parentCards = document.querySelectorAll(".side-by-side .notebook:last-child .person-card");
    
    // Build grandparents array [Pat GF, Pat GM, Mat GF, Mat GM]
    const grandparents = [
        getPersonData(grandparentCards[0], "M"), // Paternal Grandfather
        getPersonData(grandparentCards[1], "F"), // Paternal Grandmother
        getPersonData(grandparentCards[2], "M"), // Maternal Grandfather
        getPersonData(grandparentCards[3], "F")  // Maternal Grandmother
    ];
    
    // Build parents array [Father, Mother]
    const parents = [
        getPersonData(parentCards[0], "M"), // Father
        getPersonData(parentCards[1], "F")  // Mother
    ];
    
    // Get user sex and convert to backend format
    const userSexSelect = document.getElementById("userSex");
    const userSexValue = userSexSelect.value;
    const userSex = userSexValue === "Male" ? "M" : "F";
    
    // Get selected disease
    const disease = document.querySelector(".main-select").value;
    
    // Validate inputs
    if (!disease || disease === "Select disease") {
        alert("Please select a disease first!");
        return;
    }
    
    if (!userSexValue || userSexValue === "Select") {
        alert("Please select your sex!");
        return;
    }
    
    const payload = {
        disease: disease,
        grandparents: grandparents,
        parents: parents,
        user_sex: userSex
    };
    
    console.log("Sending payload:", payload); // Debug log
    
    fetch("/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Received response:", data); // Debug log
        document.getElementById("riskText").innerHTML =
            `<strong>Risk: ${(data.risk * 100).toFixed(1)}%</strong><br>${data.explanation}`;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("riskText").innerHTML =
            `<strong style="color: #ef4444;">Error calculating risk. Please check console.</strong>`;
    });
});
