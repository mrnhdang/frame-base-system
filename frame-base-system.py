# frame_demo.py

class Frame:
    def __init__(self, name, parent=None):
        self.name = name
        self.parent = parent
        self.slots = {}

    def set_slot(self, slot, value):
        self.slots[slot] = value

    def get_slot(self, slot):
        # Check own slots first, otherwise check parent
        if slot in self.slots:
            return self.slots[slot]
        elif self.parent:
            return self.parent.get_slot(slot)
        return None

    def describe(self):
        print(f"Frame: {self.name}")
        if self.parent:
            print(f"  Inherits from: {self.parent.name}")
        for k, v in self.slots.items():
            print(f"  {k}: {v}")
        print("")


# --- DEMO APPLICATION ---

# General frame for Animal
animal = Frame("Animal")
animal.set_slot("has_legs", True)
animal.set_slot("can_move", True)

# Frame for Bird (inherits from Animal)
bird = Frame("Bird", parent=animal)
bird.set_slot("has_wings", True)
bird.set_slot("can_fly", True)

# Frame for Penguin (inherits from Bird)
penguin = Frame("Penguin", parent=bird)
penguin.set_slot("can_fly", False)  # overrides

# Example instance: Tweety (a bird)
tweety = Frame("Tweety", parent=bird)
tweety.set_slot("color", "yellow")

# Example instance: Pingu (a penguin)
pingu = Frame("Pingu", parent=penguin)
pingu.set_slot("color", "black & white")

# --- TESTING ---
for f in [animal, bird, penguin, tweety, pingu]:
    f.describe()

# Reasoning demo
print("Reasoning examples:")
print(f"Tweety can fly? {tweety.get_slot('can_fly')}")
print(f"Pingu can fly? {pingu.get_slot('can_fly')}")
print(f"Pingu has legs? {pingu.get_slot('has_legs')}")
