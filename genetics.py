def autosomal_recessive(parent1, parent2):
    p1_min, p1_max = parent1
    p2_min, p2_max = parent2

    return (
        p1_min * p2_min * 0.25,
        p1_max * p2_max * 0.25
    )

def autosomal_dominant(parent1, parent2):
    p1_min, p1_max = parent1
    p2_min, p2_max = parent2

    return (
        1 - ((1 - p1_min) * (1 - p2_min)),
        1 - ((1 - p1_max) * (1 - p2_max))
    )

def x_linked_recessive(mother, user_sex):
    m_min, m_max = mother

    if user_sex == "M":
        return (m_min * 0.5, m_max * 0.5)
    else:
        return (m_min * 0.25, m_max * 0.25)
        
def infer_parent_from_grandparents(gp1, gp2):
    g1_min, g1_max = gp1
    g2_min, g2_max = gp2

    return (
        (g1_min + g2_min) / 2,
        (g1_max + g2_max) / 2
    )
