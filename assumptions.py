# assumptions.py

# Default prior probability when carrier status is unknown
DEFAULT_UNKNOWN_CARRIER_PROB = 0.5


def carrier_probability(carrier_status, affected, inheritance_type):
    """
    Converts user-provided qualitative data into internal probabilities.
    User NEVER provides probabilities directly.
    """

    # If affected, probability is effectively 1
    if affected:
        return 1.0

    if carrier_status == "known_carrier":
        return 1.0

    if carrier_status == "known_non_carrier":
        return 0.0

    # Unknown carrier status
    return DEFAULT_UNKNOWN_CARRIER_PROB
