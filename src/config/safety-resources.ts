
export type SafetyResource = {
  name: string;
  number: string;
  description: string;
  type: "child_protection" | "support" | "emergency";
};

export const UAE_SAFETY_RESOURCES: Record<
  "abuse" | "emergency" | "self_harm",
  SafetyResource[]
> = {
  abuse: [
    {
      name: "CDA Child Protection",
      number: "800988",
      description: "Dubai child protection and abuse reporting",
      type: "child_protection",
    },
    {
      name: "UAE Child Protection Centre",
      number: "116111",
      description: "Federal child abuse reporting hotline",
      type: "child_protection",
    },
    {
      name: "Dubai Foundation for Women and Children",
      number: "800111",
      description: "24/7 free support and consultations",
      type: "support",
    },
    {
      name: "Dubai Police",
      number: "999",
      description: "If the child is in immediate danger",
      type: "emergency",
    },
  ],

  emergency: [
    {
      name: "Dubai Police",
      number: "999",
      description: "Immediate danger or urgent police assistance",
      type: "emergency",
    },
    {
      name: "UAE Ambulance",
      number: "998",
      description: "Medical emergencies",
      type: "emergency",
    },
  ],

  self_harm: [
    {
      name: "Dubai Police",
      number: "999",
      description: "If someone is in immediate danger",
      type: "emergency",
    },
    {
      name: "UAE Ambulance",
      number: "998",
      description: "Urgent medical assistance",
      type: "emergency",
    },
    {
      name: "UAE Child Protection Centre",
      number: "116111",
      description: "Child protection support",
      type: "child_protection",
    },
  ],
};
