from flask import Flask,request,jsonify
from disease_map import DISEASES
from genetics import *
from assumptions import carrier_probability, infer_parent_from_grandparents

app=flask(__name__)

@app.route("/calculate", methods=["POST"])
def calculate():
    data=request.json
    disease=data["disease"]
    inheritance=DISEASES[disease]

    gps=[]
    for gp in data["grandparents"]:
        gps.append(carrier_probability(gp["carrier_status"]))

    parents=[]
    for i, parent in enumerate(data["parents"]):
        if parent[carrier_status] == "unknown":
            inferred=infer_parent_from_grandparents(
                gps[2*i], gps[i*2+1]
            )
            parents.append(inferred)
        else:
            parents.append(carrier_probability(parent[carrier_status]))

    user_sex=data["user_sex"]

    if inheritance=="autosomal_recessive":
        risk=autosomal_recessive(parents[0], parents[1])
        explanation="Both parents must carry and pass the recessive allele."
    
    elif inheritance==="recessive_dominant":
        risk=recessive_dominant(parents[0], parents[1])
        explanation="A single affected allele from either parent can cause the disease."

    else:
        