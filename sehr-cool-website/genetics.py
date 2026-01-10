def autosomal_recessive(parent1_prob, parent2_prob, parent1_affected, parent2_affected):
    if parent1_affected and parent2_affected:
        return 1.0
    return parent1_prob * parent2_prob * 0.25



def autosomal_dominant(parent1_prob, parent2_prob,
                       parent1_affected, parent2_affected):

    if parent1_affected:
        return 0.5
    if parent2_affected:
        return 0.5

    return 1 - ((1 - parent1_prob) * (1 - parent2_prob))



def x_linked_recessive(mother_prob, father_prob, child_sex, mother_affected=False):
    if child_sex == "M":
        if mother_affected:
            return 1.0
        return mother_prob * 0.5 

    else: 
        return (mother_prob * 0.5) * father_prob



def x_linked_dominant(mother_prob, father_prob, user_sex):
    if user_sex == "M":
        return mother_prob * 0.5
    
    mother_transmission = mother_prob * 0.5
    return mother_transmission + father_prob - (mother_transmission * father_prob)


def mitochondrial(mother_prob):
    return mother_prob
