# assumptions.py

# Default prior probability when carrier status is unknown
DEFAULT_UNKNOWN_CARRIER_PROB = 0.5

def carrier_probability(carrier_status, affected, inheritance_type, sex=None):
    if affected:
        return 1.0

    # Change: Known carrier is 1.0 probability of having the gene
    if carrier_status == "known_carrier":
        return 1.0

    if carrier_status == "known_non_carrier":
        return 0.0

    return 0.5 # Unknown




def infer_parent_from_grandparents(gp1_prob, gp2_prob):
    return max(gp1_prob, gp2_prob) * 0.5

def infer_mother_from_grandparents_xlr(maternal_grandfather_affected):
    if maternal_grandfather_affected:
        return 1.0  # Daughter of an affected male is always a carrier
    return 0.0
