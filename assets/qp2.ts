import type { JEEStructure } from "../src/create-qp-page/types_qp";

// Question Paper 2
export const qp2: JEEStructure = {
  id: "JEE2025_2",
  name: "Joint Entrance Examination (Main) - 2025 (Paper 2)",
  total_marks: 300,
  duration: 180,
  section: [
    {
      name: "Physics",
      totalmarks: 100,
      totalquestion: 30,
      weightage: [
        {
          type: "mcq",
          count: 20,
          marks: 4,
          positive: 4,
          negative: -1,
          questions: [
            {
              id: "P1",
              type: "mcq",
              question:
                "A body falls freely from rest. The ratio of distances covered in first, second and third seconds is:",
              options: ["1:2:3", "1:3:5", "1:4:9", "1:1:1"],
              answer: 1,
            },
            {
              id: "P2",
              type: "mcq",
              question:
                "The capacitance of a parallel plate capacitor increases when:",
              options: [
                "Area decreases",
                "Distance increases",
                "Dielectric constant increases",
                "Voltage increases",
              ],
              answer: 2,
            },
            {
              id: "P3",
              type: "mcq",
              question: "The frequency of a simple pendulum depends on:",
              options: [
                "Mass of bob",
                "Length of string",
                "Amplitude of oscillation",
                "Material of bob",
              ],
              answer: 1,
            },
            {
              id: "P4",
              type: "mcq",
              question:
                "Two bodies of masses m and 2m have equal kinetic energy. The ratio of their momenta is:",
              options: ["1:2", "1:√2", "√2:1", "2:1"],
              answer: 1,
            },
            {
              id: "P5",
              type: "mcq",
              question:
                "In a single slit diffraction, the first minimum occurs when the path difference is:",
              options: ["λ/2", "λ", "3λ/2", "2λ"],
              answer: 1,
            },
            {
              id: "P6",
              type: "mcq",
              question:
                "The electric potential inside a conducting sphere of radius R carrying charge Q is:",
              options: ["Zero", "Q/(4πε₀R)", "Variable", "Q/(8πε₀R)"],
              answer: 1,
            },
            {
              id: "P7",
              type: "mcq",
              question:
                "The stopping potential in photoelectric effect depends on:",
              options: [
                "Work function only",
                "Frequency only",
                "Both work function and frequency",
                "Intensity only",
              ],
              answer: 2,
            },
            {
              id: "P8",
              type: "mcq",
              question:
                "When a charged capacitor is connected to an uncharged capacitor, the total energy:",
              options: [
                "Increases",
                "Decreases",
                "Remains same",
                "Becomes zero",
              ],
              answer: 1,
            },
            {
              id: "P9",
              type: "mcq",
              question: "The magnetic field inside a solenoid is:",
              options: [
                "Zero",
                "Uniform",
                "Maximum at center",
                "Minimum at center",
              ],
              answer: 1,
            },
            {
              id: "P10",
              type: "mcq",
              question:
                "A ball is thrown horizontally from a height h. The time to reach ground depends on:",
              options: [
                "Initial velocity",
                "Height h only",
                "Mass of ball",
                "Both height and velocity",
              ],
              answer: 1,
            },
            {
              id: "P11",
              type: "mcq",
              question:
                "In a series LCR circuit at resonance, the impedance is:",
              options: ["Maximum", "Minimum", "Zero", "Infinite"],
              answer: 1,
            },
            {
              id: "P12",
              type: "mcq",
              question: "The energy density in an electric field E is:",
              options: ["ε₀E²", "½ε₀E²", "2ε₀E²", "ε₀E²/2"],
              answer: 1,
            },
            {
              id: "P13",
              type: "mcq",
              question:
                "In an isothermal process, the internal energy of an ideal gas:",
              options: [
                "Increases",
                "Decreases",
                "Remains constant",
                "May increase or decrease",
              ],
              answer: 2,
            },
            {
              id: "P14",
              type: "mcq",
              question: "The intensity of sound is proportional to:",
              options: [
                "Amplitude",
                "Square of amplitude",
                "Frequency",
                "Square of frequency",
              ],
              answer: 1,
            },
            {
              id: "P15",
              type: "mcq",
              question:
                "The orbital velocity of a satellite is independent of:",
              options: [
                "Mass of satellite",
                "Mass of planet",
                "Radius of orbit",
                "Gravitational constant",
              ],
              answer: 0,
            },
            {
              id: "P16",
              type: "mcq",
              question:
                "X-rays are produced when high energy electrons strike a metal target due to:",
              options: [
                "Photoelectric effect",
                "Compton effect",
                "Bremsstrahlung",
                "Pair production",
              ],
              answer: 2,
            },
            {
              id: "P17",
              type: "mcq",
              question:
                "The temperature coefficient of resistance is positive for:",
              options: [
                "Metals",
                "Semiconductors",
                "Insulators",
                "Superconductors",
              ],
              answer: 0,
            },
            {
              id: "P18",
              type: "mcq",
              question: "The energy of X-ray photon is proportional to:",
              options: [
                "Wavelength",
                "Square of wavelength",
                "Frequency",
                "Square of frequency",
              ],
              answer: 2,
            },
            {
              id: "P19",
              type: "mcq",
              question:
                "Three resistors of 2Ω, 3Ω and 6Ω are connected in parallel. The equivalent resistance is:",
              options: ["11Ω", "1Ω", "0.5Ω", "2Ω"],
              answer: 1,
            },
            {
              id: "P20",
              type: "mcq",
              question: "The binding energy per nucleon is maximum for:",
              options: [
                "Light nuclei",
                "Heavy nuclei",
                "Medium nuclei",
                "All nuclei",
              ],
              answer: 2,
            },
          ],
        },
        {
          type: "nat",
          count: 10,
          attempt: 5,
          marks: 4,
          positive: 4,
          negative: 0,
          questions: [
            {
              id: "P21",
              type: "nat",
              question:
                "A stone is dropped from rest. Find the velocity after 4 seconds in m/s. (g = 10 m/s²)",
              start: 35,
              end: 45,
              precision: 0,
            },
            {
              id: "P22",
              type: "nat",
              question:
                "A capacitor of 10 μF is charged to 100 V. Find the energy stored in μJ.",
              start: 45,
              end: 55,
              precision: 0,
            },
            {
              id: "P23",
              type: "nat",
              question:
                "A mass of 0.5 kg oscillates with frequency 2 Hz. Find the spring constant in N/m. (π² = 10)",
              start: 75,
              end: 85,
              precision: 0,
            },
            {
              id: "P24",
              type: "nat",
              question:
                "Find the wavelength of electromagnetic radiation of frequency 6 × 10¹⁴ Hz in nanometers. (c = 3 × 10⁸ m/s)",
              start: 450,
              end: 550,
              precision: 0,
            },
            {
              id: "P25",
              type: "nat",
              question:
                "In a Bohr atom, find the ratio of kinetic energy to total energy for any orbit.",
              start: -1,
              end: 1,
              precision: 0,
            },
            {
              id: "P26",
              type: "nat",
              question:
                "A disc of radius 0.5 m and mass 2 kg rotates about its center. Find moment of inertia in kg⋅m².",
              start: 0.2,
              end: 0.3,
              precision: 1,
            },
            {
              id: "P27",
              type: "nat",
              question:
                "Two point charges +4μC and +9μC are 3 cm apart. Find force between them in N. (k = 9 × 10⁹)",
              start: 350,
              end: 370,
              precision: 0,
            },
            {
              id: "P28",
              type: "nat",
              question:
                "A concave mirror has focal length 15 cm. Object at 45 cm gives image at distance in cm:",
              start: 22,
              end: 24,
              precision: 0,
            },
            {
              id: "P29",
              type: "nat",
              question:
                "Current through 8Ω resistor when 24V is applied across series combination of 8Ω and 4Ω. Find current in A.",
              start: 1.8,
              end: 2.2,
              precision: 1,
            },
            {
              id: "P30",
              type: "nat",
              question:
                "A wheel of radius 1 m rolls without slipping with velocity 5 m/s. Find angular velocity in rad/s.",
              start: 4,
              end: 6,
              precision: 0,
            },
          ],
        },
      ],
    },
    {
      name: "Chemistry",
      totalmarks: 100,
      totalquestion: 30,
      weightage: [
        {
          type: "mcq",
          count: 20,
          marks: 4,
          positive: 4,
          negative: -2,
          questions: [
            {
              id: "C1",
              type: "mcq",
              question: "The electronic configuration of Fe³⁺ is:",
              options: ["[Ar] 3d⁵", "[Ar] 3d³", "[Ar] 3d⁶", "[Ar] 4s¹ 3d⁴"],
              answer: 0,
            },
            {
              id: "C2",
              type: "mcq",
              question:
                "Which of the following is the most electronegative element?",
              options: ["Oxygen", "Fluorine", "Nitrogen", "Chlorine"],
              answer: 1,
            },
            {
              id: "C3",
              type: "mcq",
              question:
                "The equivalent weight of H₃PO₄ in the reaction H₃PO₄ + 2NaOH → Na₂HPO₄ + 2H₂O is:",
              options: ["98", "49", "32.7", "24.5"],
              answer: 1,
            },
            {
              id: "C4",
              type: "mcq",
              question:
                "A buffer solution contains equal moles of CH₃COOH and CH₃COONa. The pH is:",
              options: [
                "Equal to pKₐ",
                "Less than pKₐ",
                "Greater than pKₐ",
                "Equal to 7",
              ],
              answer: 0,
            },
            {
              id: "C5",
              type: "mcq",
              question:
                "Which of the following can act as both Lewis acid and Lewis base?",
              options: ["BF₃", "NH₃", "H₂O", "AlCl₃"],
              answer: 2,
            },
            {
              id: "C6",
              type: "mcq",
              question: "The oxidation state of manganese in KMnO₄ is:",
              options: ["+6", "+7", "+5", "+4"],
              answer: 1,
            },
            {
              id: "C7",
              type: "mcq",
              question: "Toluene on oxidation with KMnO₄ gives:",
              options: [
                "Benzoic acid",
                "Benzaldehyde",
                "Phenol",
                "Benzyl alcohol",
              ],
              answer: 0,
            },
            {
              id: "C8",
              type: "mcq",
              question: "Which of the following is a tertiary alcohol?",
              options: ["CH₃CH₂CH₂OH", "(CH₃)₂CHOH", "(CH₃)₃COH", "CH₃OH"],
              answer: 2,
            },
            {
              id: "C9",
              type: "mcq",
              question: "The IUPAC name of (CH₃)₂CHCH₂COOH is:",
              options: [
                "2-methylbutanoic acid",
                "3-methylbutanoic acid",
                "2-methylpropanoic acid",
                "Isovaleric acid",
              ],
              answer: 1,
            },
            {
              id: "C10",
              type: "mcq",
              question: "The number of π bonds in acetylene (C₂H₂) is:",
              options: ["1", "2", "3", "4"],
              answer: 1,
            },
            {
              id: "C11",
              type: "mcq",
              question: "Which element has the largest atomic radius?",
              options: ["Li", "Na", "K", "Cs"],
              answer: 3,
            },
            {
              id: "C12",
              type: "mcq",
              question: "The shape of ClF₃ molecule is:",
              options: ["Trigonal planar", "T-shaped", "Pyramidal", "Linear"],
              answer: 1,
            },
            {
              id: "C13",
              type: "mcq",
              question: "For a first order reaction, the half-life is:",
              options: [
                "Independent of initial concentration",
                "Proportional to initial concentration",
                "Inversely proportional to initial concentration",
                "Proportional to square of initial concentration",
              ],
              answer: 0,
            },
            {
              id: "C14",
              type: "mcq",
              question: "Which of the following is a synthetic polymer?",
              options: ["Cellulose", "Starch", "Teflon", "Protein"],
              answer: 2,
            },
            {
              id: "C15",
              type: "mcq",
              question: "The geometry around copper in [Cu(NH₃)₄]²⁺ is:",
              options: ["Tetrahedral", "Square planar", "Octahedral", "Linear"],
              answer: 1,
            },
            {
              id: "C16",
              type: "mcq",
              question: "Which of the following molecules is diamagnetic?",
              options: ["O₂", "NO", "N₂", "NO₂"],
              answer: 2,
            },
            {
              id: "C17",
              type: "mcq",
              question:
                "The van't Hoff factor for Al₂(SO₄)₃ assuming complete dissociation is:",
              options: ["3", "4", "5", "6"],
              answer: 2,
            },
            {
              id: "C18",
              type: "mcq",
              question:
                "For a reversible reaction, at equilibrium the entropy change is:",
              options: ["Positive", "Negative", "Zero", "Infinite"],
              answer: 2,
            },
            {
              id: "C19",
              type: "mcq",
              question: "The flame test for sodium gives:",
              options: [
                "Yellow color",
                "Green color",
                "Red color",
                "Blue color",
              ],
              answer: 0,
            },
            {
              id: "C20",
              type: "mcq",
              question: "Neoprene is a polymer of:",
              options: ["Chloroprene", "Isoprene", "Butadiene", "Styrene"],
              answer: 0,
            },
          ],
        },
        {
          type: "nat",
          count: 10,
          attempt: 5,
          marks: 4,
          positive: 4,
          negative: 0,
          questions: [
            {
              id: "C21",
              type: "nat",
              question:
                "Calculate the molality of a solution containing 40g NaOH in 500g water. (Molar mass NaOH = 40)",
              start: 1.8,
              end: 2.2,
              precision: 1,
            },
            {
              id: "C22",
              type: "nat",
              question: "Find the pH of 0.01 M Ba(OH)₂ solution.",
              start: 11.8,
              end: 12.4,
              precision: 1,
            },
            {
              id: "C23",
              type: "nat",
              question: "How many neutrons are present in ²³⁵U?",
              start: 142,
              end: 146,
              precision: 0,
            },
            {
              id: "C24",
              type: "nat",
              question: "The number of chiral carbons in glucose is:",
              start: 3,
              end: 5,
              precision: 0,
            },
            {
              id: "C25",
              type: "nat",
              question:
                "At STP, what volume in liters does 0.25 moles of any gas occupy?",
              start: 5.4,
              end: 5.8,
              precision: 1,
            },
            {
              id: "C26",
              type: "nat",
              question: "Find the oxidation number of phosphorus in H₄P₂O₇.",
              start: 4,
              end: 6,
              precision: 0,
            },
            {
              id: "C27",
              type: "nat",
              question: "How many sigma bonds are present in ethane (C₂H₆)?",
              start: 6,
              end: 8,
              precision: 0,
            },
            {
              id: "C28",
              type: "nat",
              question: "The normality of 2M H₂SO₄ solution is:",
              start: 3,
              end: 5,
              precision: 0,
            },
            {
              id: "C29",
              type: "nat",
              question:
                "The magnetic moment of Ti³⁺ ion in Bohr magnetons is approximately:",
              start: 1.5,
              end: 2.0,
              precision: 1,
            },
            {
              id: "C30",
              type: "nat",
              question:
                "The number of geometrical isomers of [Co(en)₂Cl₂]⁺ is:",
              start: 1,
              end: 3,
              precision: 0,
            },
          ],
        },
      ],
    },
    {
      name: "Mathematics",
      totalmarks: 100,
      totalquestion: 30,
      weightage: [
        {
          type: "mcq",
          count: 20,
          marks: 4,
          positive: 4,
          negative: 0,
          questions: [
            {
              id: "M1",
              type: "mcq",
              question: "If cos θ = -1/2, then θ in [0, 2π] is:",
              options: ["π/3", "2π/3", "4π/3", "Both 2π/3 and 4π/3"],
              answer: 3,
            },
            {
              id: "M2",
              type: "mcq",
              question: "The derivative of e^(2x) is:",
              options: ["e^(2x)", "2e^(2x)", "e^(2x)/2", "2xe^(2x)"],
              answer: 1,
            },
            {
              id: "M3",
              type: "mcq",
              question: "The integral of e^x dx is:",
              options: ["e^x + C", "xe^x + C", "e^(x+1) + C", "e^x/x + C"],
              answer: 0,
            },
            {
              id: "M4",
              type: "mcq",
              question: "If A = {1, 2} and B = {3, 4}, then A × B has:",
              options: ["2 elements", "4 elements", "6 elements", "8 elements"],
              answer: 1,
            },
            {
              id: "M5",
              type: "mcq",
              question: "The slope of the line 3x + 4y = 12 is:",
              options: ["3/4", "-3/4", "4/3", "-4/3"],
              answer: 1,
            },
            {
              id: "M6",
              type: "mcq",
              question: "The middle term in the expansion of (x + y)^6 is:",
              options: ["15x³y³", "20x³y³", "10x³y³", "6x³y³"],
              answer: 1,
            },
            {
              id: "M7",
              type: "mcq",
              question:
                "If one root of x² - 7x + 12 = 0 is 3, then the other root is:",
              options: ["4", "5", "6", "7"],
              answer: 0,
            },
            {
              id: "M8",
              type: "mcq",
              question:
                "The midpoint of line segment joining (2, 3) and (6, 7) is:",
              options: ["(4, 5)", "(8, 10)", "(2, 2)", "(3, 4)"],
              answer: 0,
            },
            {
              id: "M9",
              type: "mcq",
              question: "If log₃ x = 2, then x is:",
              options: ["6", "8", "9", "12"],
              answer: 2,
            },
            {
              id: "M10",
              type: "mcq",
              question: "If g(x) = 2x - 3, then g(5) is:",
              options: ["7", "8", "10", "13"],
              answer: 0,
            },
            {
              id: "M11",
              type: "mcq",
              question: "The sum of first n odd numbers is:",
              options: ["n²", "n(n+1)", "n(n+1)/2", "2n-1"],
              answer: 0,
            },
            {
              id: "M12",
              type: "mcq",
              question:
                "The area of triangle with vertices (1,1), (3,1), and (2,4) is:",
              options: ["3", "4", "5", "6"],
              answer: 0,
            },
            {
              id: "M13",
              type: "mcq",
              question: "If z = 3 + 4i, then |z| is:",
              options: ["3", "4", "5", "7"],
              answer: 2,
            },
            {
              id: "M14",
              type: "mcq",
              question: "The sum of coefficients in (1 + x)^n is:",
              options: ["n", "2^n", "n!", "2n"],
              answer: 1,
            },
            {
              id: "M15",
              type: "mcq",
              question: "The range of f(x) = sin x is:",
              options: ["[0, 1]", "[-1, 1]", "[0, π]", "(-∞, ∞)"],
              answer: 1,
            },
            {
              id: "M16",
              type: "mcq",
              question:
                "If A and B are square matrices of same order, then |AB| equals:",
              options: ["|A| + |B|", "|A| - |B|", "|A| × |B|", "|A| / |B|"],
              answer: 2,
            },
            {
              id: "M17",
              type: "mcq",
              question: "The foci of the ellipse x²/25 + y²/9 = 1 are at:",
              options: ["(±3, 0)", "(±4, 0)", "(±5, 0)", "(0, ±3)"],
              answer: 1,
            },
            {
              id: "M18",
              type: "mcq",
              question:
                "Two dice are thrown. The probability of getting sum 7 is:",
              options: ["1/6", "1/9", "1/12", "1/3"],
              answer: 0,
            },
            {
              id: "M19",
              type: "mcq",
              question: "The value of ∫₀² x² dx is:",
              options: ["4/3", "8/3", "4", "8"],
              answer: 1,
            },
            {
              id: "M20",
              type: "mcq",
              question:
                "If |a⃗| = 3 and |b⃗| = 4, and a⃗ ⊥ b⃗, then |a⃗ + b⃗| is:",
              options: ["5", "7", "1", "12"],
              answer: 0,
            },
          ],
        },
        {
          type: "nat",
          count: 10,
          attempt: 5,
          marks: 4,
          positive: 4,
          negative: 0,
          questions: [
            {
              id: "M21",
              type: "nat",
              question: "Find the value of 3⁴ - 2³ + 1.",
              start: 70,
              end: 76,
              precision: 0,
            },
            {
              id: "M22",
              type: "nat",
              question: "If h(x) = x³ - 2x + 1, find h(3).",
              start: 20,
              end: 24,
              precision: 0,
            },
            {
              id: "M23",
              type: "nat",
              question: "Find the number of permutations of the word GARDEN.",
              start: 715,
              end: 725,
              precision: 0,
            },
            {
              id: "M24",
              type: "nat",
              question:
                "Find the circumference of a circle with diameter 14 units. (Take π = 22/7)",
              start: 42,
              end: 46,
              precision: 0,
            },
            {
              id: "M25",
              type: "nat",
              question:
                "If log₁₀ 3 = 0.477, find log₁₀ 27 (answer as integer after multiplying by 1000).",
              start: 1430,
              end: 1435,
              precision: 0,
            },
            {
              id: "M26",
              type: "nat",
              question: "Find the 8th term of GP: 3, 6, 12, 24, ...",
              start: 380,
              end: 390,
              precision: 0,
            },
            {
              id: "M27",
              type: "nat",
              question:
                "If sin θ = 5/13, find cos θ (considering θ in first quadrant).",
              start: 11,
              end: 13,
              precision: 0,
            },
            {
              id: "M28",
              type: "nat",
              question:
                "Find the number of sides of a polygon whose each interior angle is 144°.",
              start: 8,
              end: 12,
              precision: 0,
            },
            {
              id: "M29",
              type: "nat",
              question: "The variance of data 2, 4, 6, 8, 10 is:",
              start: 6,
              end: 10,
              precision: 0,
            },
            {
              id: "M30",
              type: "nat",
              question: "Find the value of ⁷P₃.",
              start: 205,
              end: 215,
              precision: 0,
            },
          ],
        },
      ],
    },
  ],
};
