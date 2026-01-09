from flask import Flask,request,jsonify,render_template
from disease_map import DISEASES
from genetics import *
from assumptions import carrier_probability, infer_parent_from_grandparents,infer_mother_from_grandparents_xlr



app=Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/calculate", methods=["POST"])
def calculate():
    data=request.json
    disease=data["disease"]
    inheritance=DISEASES[disease]

    gps=[]
    for gp in data["grandparents"]:
        gps.append(
            carrier_probability(
                carrier_status=gp["carrier_status"],
                affected=gp["affected"],
                inheritance_type=inheritance,
                # sex=gp["sex"]
            )
        )

    parents=[]
# Inside the parents loop in app.py
    for i, parent in enumerate(data["parents"]):
        if parent["carrier_status"] == "unknown":
            if inheritance == "x_linked_recessive" and parent["sex"] == "F":
                # Use the specific X-linked inference logic
                # maternal grandfather is gps[2*i]
                inferred = infer_mother_from_grandparents_xlr(data["grandparents"][2*i]["affected"])
                parents.append(inferred)
            else:
                inferred = infer_parent_from_grandparents(gps[2*i], gps[i*2+1])
                parents.append(inferred)
        else:
            
            parents.append(
                carrier_probability(
                    carrier_status=parent["carrier_status"],
                    affected=parent["affected"],
                    inheritance_type=inheritance,
                    sex=parent["sex"]
                )
            )
    # --- Autosomal dominant: infer parent probability from grandparents ---
    if inheritance == "autosomal_dominant":
        for i, parent in enumerate(data["parents"]):
            if parent["carrier_status"] == "unknown" and not parent["affected"]:
                gp1_prob = gps[2 * i]
                gp2_prob = gps[2 * i + 1]

                parents[i] = infer_parent_from_grandparents(gp1_prob, gp2_prob)



    user_sex=data["user_sex"]

    if inheritance=="autosomal_recessive":
        risk = autosomal_recessive(
            parent1_prob=parents[0],
            parent2_prob=parents[1],
            parent1_affected=data["parents"][0]["affected"],
            parent2_affected=data["parents"][1]["affected"]
        )

        explanation="Both parents must carry and pass the recessive allele."
    
    elif inheritance == "autosomal_dominant":
        risk = autosomal_dominant(
            parent1_prob=parents[0],
            parent2_prob=parents[1],
            parent1_affected=data["parents"][0]["affected"],
            parent2_affected=data["parents"][1]["affected"]
        )

        explanation = "A single affected allele from either parent can cause the disease."


    elif inheritance == "x_linked_dominant":
        # Identify mother and father by sex attribute
        mother_idx = 0 if data["parents"][0]["sex"] == "F" else 1
        father_idx = 1 if mother_idx == 0 else 0
        
        # Pass the indexed probabilities from the parents list
        risk = x_linked_dominant(
            mother_prob=parents[mother_idx],
            father_prob=parents[father_idx],
            user_sex=data["user_sex"]
        )
        explanation = "In X-linked dominant inheritance, one copy of the gene causes the condition."
    
    elif inheritance == "mitochondrial":
        # Identify the mother's index
        mother_idx = 0 if data["parents"][0]["sex"] == "F" else 1
        
        # Calculate risk based ONLY on the mother
        risk = mitochondrial(parents[mother_idx])
        explanation = "Mitochondrial diseases are inherited exclusively from the mother."

    elif inheritance == "x_linked_recessive":
        # Identify mother and father by sex attribute
        mother_idx = 0 if data["parents"][0]["sex"] == "F" else 1
        father_idx = 1 if mother_idx == 0 else 0
        
        # Calculate risk using identified parents
        risk = x_linked_recessive(
            mother_prob=parents[mother_idx], 
            father_prob=parents[father_idx],
            child_sex=data["user_sex"],
            mother_affected=data["parents"][mother_idx]["affected"]
        )
        explanation = "Risk depends on maternal carrier status and paternal affected status."

    return jsonify({
        "disease":disease,
        "inheritance": inheritance,
        "risk":round(risk,3),
        "explanation": explanation
    })

if __name__=="__main__":
    app.run(debug=True)

# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# # -----------------------------------------
# # Carrier inference from grandparents
# # -----------------------------------------
# def infer_parent_carrier(grandfather, grandmother):
#     # Autosomal recessive assumptions
#     if grandfather["status"] == "affected" or grandmother["status"] == "affected":
#         return 1.0
#     if grandfather["status"] == "carrier" or grandmother["status"] == "carrier":
#         return 0.5
#     return 0.25  # both unaffected


# def parent_carrier_probability(status, grandfather, grandmother):
#     if status == "affected":
#         return 1.0
#     if status == "carrier":
#         return 1.0
#     if status == "unaffected":
#         return 0.0
#     return infer_parent_carrier(grandfather, grandmother)


# # -----------------------------------------
# # API
# # -----------------------------------------
# @app.route("/calculate", methods=["POST"])
# def calculate():
#     data = request.json

#     maternal = data["grandparents"]["maternal"]
#     paternal = data["grandparents"]["paternal"]

#     mother_status = data["parents"]["mother"]["status"]
#     father_status = data["parents"]["father"]["status"]

#     mother_prob = parent_carrier_probability(
#         mother_status,
#         maternal["grandfather"],
#         maternal["grandmother"]
#     )

#     father_prob = parent_carrier_probability(
#         father_status,
#         paternal["grandfather"],
#         paternal["grandmother"]
#     )

#     # Autosomal recessive child risk
#     child_risk = mother_prob * father_prob * 0.25 * 100

#     return jsonify({
#         "mother_carrier_probability": mother_prob,
#         "father_carrier_probability": father_prob,
#         "child_risk_percent": round(child_risk, 2)
#     })


# if __name__ == "__main__":
#     app.run(debug=True)
