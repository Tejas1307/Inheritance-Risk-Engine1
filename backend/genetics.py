def autosomal_recessive(parent1_prob, parent2_prob, parent1_affected, parent2_affected):
    if parent1_affected and parent2_affected:
        return 1.0
    return parent1_prob * parent2_prob * 0.25



def autosomal_dominant(parent1_prob, parent2_prob,
                       parent1_affected, parent2_affected):

    # If parent is affected, they must have mutation → 50% transmission
    if parent1_affected:
        return 0.5
    if parent2_affected:
        return 0.5

    # Otherwise propagate inferred probabilities
    return 1 - ((1 - parent1_prob) * (1 - parent2_prob))





def x_linked_recessive(mother_prob, father_prob, child_sex, mother_affected=False):
    if child_sex == "M":
        if mother_affected:
            return 1.0
        # Risk = Prob mother is carrier (mother_prob) * 50% transmission
        return mother_prob * 0.5 

    else: # Female child
        # Father passes his ONLY X (1.0 if affected, 0.0 if not)
        # Mother passes her mutant X with 50% probability if she's a carrier
        # Risk = (Mother Carrier Prob * 0.5) * (Father Affected Prob)
        return (mother_prob * 0.5) * father_prob



def x_linked_dominant(mother_prob, father_prob, user_sex):
    if user_sex == "M":
        # Sons only get the X from their mother
        # Risk = Probability mother has gene * 0.5 transmission rate
        return mother_prob * 0.5
    
    # Daughters get one X from each parent
    # Father passes his ONLY X (100% if affected)
    # Mother passes her affected X with 50% probability
    mother_transmission = mother_prob * 0.5
    return mother_transmission + father_prob - (mother_transmission * father_prob)


def mitochondrial(mother_prob):
    return mother_prob
