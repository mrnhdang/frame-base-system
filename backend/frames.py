# Simple frame engine inspired by PIP / Internist-1

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Set

@dataclass
class Frame:
    name: str
    parent: Optional["Frame"] = None
    findings: Dict[str, float] = field(default_factory=dict)  # symptom -> weight
    rules: Dict[str, List[str]] = field(default_factory=dict) # must_have / must_not_have
    children: List["Frame"] = field(default_factory=list)

    def __post_init__(self):
        if self.parent:
            self.parent.children.append(self)

    def add_finding(self, symptom: str, weight: float = 1.0):
        self.findings[symptom] = weight

    def add_rule(self, rule_type: str, symptom: str):
        self.rules.setdefault(rule_type, []).append(symptom)

    def match_score(self, patient_symptoms: Set[str]) -> float:
        # rule: must_not_have -> immediate disqualify
        for s in self.rules.get("must_not_have", []):
            if s in patient_symptoms:
                return 0.0

        # rule: must_have -> all must present
        for s in self.rules.get("must_have", []):
            if s not in patient_symptoms:
                return 0.0

        # score findings by weights for present symptoms
        score = 0.0
        for s, w in self.findings.items():
            if s in patient_symptoms:
                score += w
        return score


class KB:
    def __init__(self):
        self.root = Frame("Disease", None)
        self._seed()

    def _seed(self):
        # Flu
        flu = Frame("Flu", self.root)
        flu.add_finding("fever", 2.0)
        flu.add_finding("cough", 1.5)
        flu.add_finding("headache", 1.0)
        flu.add_finding("myalgia", 1.0)

        # Common Cold
        cold = Frame("Common Cold", self.root)
        cold.add_finding("cough", 2.0)
        cold.add_finding("sore throat", 1.5)
        cold.add_finding("runny nose", 2.0)
        cold.add_finding("sneezing", 1.0)
        cold.add_rule("must_not_have", "high_fever")

        # Pneumonia
        pneu = Frame("Pneumonia", self.root)
        pneu.add_finding("fever", 2.0)
        pneu.add_finding("productive cough", 2.0)
        pneu.add_finding("shortness of breath", 2.0)
        pneu.add_finding("chest pain", 1.5)

        # Nephrotic Syndrome (from slides spirit)
        neph = Frame("Nephrotic Syndrome", self.root)
        neph.add_finding("edema", 2.5)
        neph.add_finding("proteinuria", 3.0)
        neph.add_rule("must_not_have", "proteinuria_absent")

        # Subclass example (Viral Hepatitis -> Alcoholic Hepatitis)
        hep = Frame("Hepatitis", self.root)
        hep.add_finding("jaundice", 2.0)
        hep.add_finding("elevated ALT/AST", 2.5)

        alco = Frame("Alcoholic Hepatitis", hep)
        alco.add_finding("alcohol_history", 3.0)
        alco.add_finding("jaundice", 1.5)

    # --- Utilities for API ---

    def diseases(self) -> List[Frame]:
        return list(self.root.children)

    def all_symptoms(self) -> List[str]:
        seen = set()
        def walk(f: Frame):
            for s in f.findings:
                seen.add(s)
            for rtype, vals in f.rules.items():
                for v in vals:
                    seen.add(v)
            for c in f.children:
                walk(c)
        walk(self.root)
        return sorted(seen)

    def diagnose(self, patient_symptoms: Set[str]):
        results = []
        details = {}
        def collect(f: Frame):
            if f is self.root: 
                pass
            else:
                score = f.match_score(patient_symptoms)
                if score > 0:
                    results.append((f.name, score))
                    # explain which findings contributed
                    matched = {s: w for s, w in f.findings.items() if s in patient_symptoms}
                    unmet_must = [s for s in f.rules.get("must_have", []) if s not in patient_symptoms]
                    forbidden = [s for s in f.rules.get("must_not_have", []) if s in patient_symptoms]
                    details[f.name] = {
                        "matched_findings": matched,
                        "unmet_must": unmet_must,
                        "forbidden_present": forbidden,
                        "total": score
                    }
            for c in f.children:
                collect(c)
        collect(self.root)
        results.sort(key=lambda x: x[1], reverse=True)
        return results, details

    def to_graph(self):
        # nodes and edges for a simple hierarchy view
        nodes, edges = [], []
        idx = {}
        def walk(f: Frame):
            idx[f.name] = len(nodes)
            nodes.append({
                "id": f.name,
                "label": f.name,
                "findings": f.findings,
                "rules": f.rules
            })
            for c in f.children:
                edges.append({"from": f.name, "to": c.name})
                walk(c)
        walk(self.root)
        return {"nodes": nodes, "edges": edges}


kb = KB()
