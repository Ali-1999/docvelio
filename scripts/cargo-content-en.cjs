/* Docvelio's original cargo tool guides. */
module.exports=[
  {
    "slug": "cbm-calculator",
    "root": true,
    "title": "CBM Calculator – Calculate Shipping Volume & Weight Online",
    "desc": "Free CBM calculator for cartons and shipping. Enter dimensions, quantity and weight to calculate cubic metres, cubic feet, volumetric weight and container usage.",
    "h1": "CBM Calculator for Shipping and Freight",
    "intro": "Calculate total shipment volume in cubic metres (CBM), cubic feet (CFT), actual mass and estimated dimensional weight. Add multiple carton types and compare theoretical 20 ft, 40 ft and 40 ft high-cube container utilisation.",
    "para": [
      [
        "How to calculate CBM for shipping",
        "CBM stands for cubic metres. Convert length, width and height to metres, multiply the three values to find one carton's volume, and multiply by the number of identical cartons. For a mixed shipment, repeat for each carton size and add the results. The calculator handles millimetres, centimetres, metres, inches, feet and yards, so you do not need to convert dimensions manually."
      ],
      [
        "CBM formula with a worked example",
        "A carton measuring 60 cm × 40 cm × 40 cm occupies 0.096 m³. For 200 identical cartons, the total is 19.2 m³ (about 678.04 ft³). If each carton weighs 25 kg, the shipment weighs 5,000 kg. These are measurements, not a carrier quote or an actual container loading diagram."
      ],
      [
        "Actual weight versus dimensional weight",
        "Dimensional weight accounts for the space occupied by a light but bulky shipment. For centimetre inputs, one commonly used courier calculation divides length × width × height by 5,000 to obtain kilograms. Different couriers or air cargo contracts can use other divisors and rounding rules. Set your carrier's agreed divisor and compare it with the total actual weight."
      ],
      [
        "Estimating container utilisation",
        "The reference volumes used here are approximately 33.2 m³ for a 20 ft dry container, 67.7 m³ for a 40 ft dry container, and 76.3 m³ for a 40 ft high cube. The results show volume utilisation and a separate planning count at your chosen assumed fill percentage. Packing geometry, stacking strength, pallets, door clearance, payload restrictions and individual container dimensions can all change actual suitability."
      ]
    ],
    "steps": [
      "Enter the dimensions, unit of measurement, weight per carton and quantity.",
      "Add rows for other carton sizes or products; adjust the dimensional divisor if the carrier specifies one.",
      "Review CBM, CFT, mass, estimated chargeable weight and container-volume percentages; download the CSV if needed."
    ],
    "faq": [
      [
        "What does CBM mean?",
        "CBM is cubic metres (m³), a unit measuring three-dimensional space occupied by cargo."
      ],
      [
        "How many cubic feet equal one CBM?",
        "One cubic metre equals approximately 35.3147 cubic feet."
      ],
      [
        "Can CBM alone tell me how many cartons physically fit?",
        "No. It measures volume, but actual packing depends on carton geometry, loading orientation, clearances and weight restrictions."
      ]
    ]
  },
  {
    "slug": "cubic-meter-calculator",
    "title": "Cubic Meter Calculator (m³) – Calculate Volume of Boxes",
    "desc": "Calculate cubic metres from length, width and height in cm, m, mm, inches or feet. Add multiple box quantities and see cubic-foot equivalents instantly.",
    "h1": "Cubic Meter Calculator for Boxes and Cargo",
    "intro": "Find how many cubic metres a box, crate or stack of identical cartons occupies. Convert different length units into one consistent m³ result.",
    "para": [
      [
        "How to calculate a cubic metre",
        "A cubic metre is the space inside a cube measuring one metre by one metre by one metre. For a rectangular box, volume in m³ equals length (m) × width (m) × height (m). If your dimensions are in centimetres, multiply them and divide by one million. For millimetres, divide the product by one billion."
      ],
      [
        "Example with multiple boxes",
        "A 50 × 40 × 30 cm box uses 0.06 m³. A hundred such boxes occupy 6 m³ by volume, before pallets, gaps and packaging arrangements. Enter quantity and weight per box to see both volume and actual total mass. Multiple rows let you combine differently sized cartons."
      ],
      [
        "When cubic metres are useful",
        "Cubic metres help with warehouse planning, moving quotes, packing-list preparation and sea-freight volume estimates. Cubic capacity is not the same as usable floor space, and an irregular load may leave significant unused gaps. Always check any carrier's specific measurement and rounding instructions."
      ]
    ],
    "steps": [
      "Choose the unit for each set of box dimensions.",
      "Enter length, width, height and quantity for every group.",
      "Read total cubic metres and corresponding cubic feet; export the calculation summary."
    ],
    "faq": [
      [
        "What is the formula for CBM in centimetres?",
        "Length × width × height ÷ 1,000,000 gives m³ for dimensions in centimetres."
      ],
      [
        "Does a cubic metre tell me the weight?",
        "No. Volume and mass are distinct measurements; enter actual weight separately."
      ]
    ]
  },
  {
    "slug": "cubic-feet-calculator",
    "title": "Cubic Feet Calculator (CFT) – Convert Carton Volume to ft³",
    "desc": "Calculate cubic feet (CFT or ft³) from feet, inches, centimetres or metres. Estimate shipping volume for a single package or mixed cargo.",
    "h1": "Cubic Feet Calculator for Freight and Moving",
    "intro": "Calculate CFT from your boxes and convert the same shipment to cubic metres using consistent, checked unit conversions.",
    "para": [
      [
        "Cubic feet formula",
        "If dimensions are in feet, multiply length × width × height to obtain cubic feet. For dimensions in inches, divide their product by 1,728. The calculator accepts inches, feet, centimetres, metres, millimetres and yards; it converts to metres internally to keep mixed inputs consistent."
      ],
      [
        "Example of a box in feet",
        "A 2 ft × 2 ft × 3 ft box occupies 12 ft³, equivalent to about 0.3398 m³. Ten such boxes occupy 120 ft³ before gaps between boxes. Cubic feet are often used in household removals and freight quotations in markets that use imperial measurements."
      ],
      [
        "CFT is not loadability",
        "Even if the aggregate cargo cubic feet is below a container's theoretical cubic feet, individual items may be too wide for the door or difficult to arrange efficiently. Use this result as a volume reference and confirm physical loading arrangements separately."
      ]
    ],
    "steps": [
      "Select ft or in for dimensions, or use another supported length unit.",
      "Enter the package dimensions and quantity; add additional rows if needed.",
      "Compare the calculated ft³ and m³ totals and review your cargo details."
    ],
    "faq": [
      [
        "How many cubic feet are in one cubic metre?",
        "Approximately 35.3147 ft³."
      ],
      [
        "How do I convert cubic inches to cubic feet?",
        "Divide cubic inches by 1,728."
      ]
    ]
  },
  {
    "slug": "volumetric-weight-calculator",
    "title": "Volumetric Weight Calculator – Air Freight & Courier Dim Weight",
    "desc": "Compare actual weight with dimensional weight in kg or lb. Use a configurable 5000 or 6000 divisor for parcels and multi-carton air shipments.",
    "h1": "Volumetric Weight and Chargeable Weight Calculator",
    "intro": "Estimate the dimensional weight of cartons and compare it with actual shipment weight using a configurable centimetre-based divisor.",
    "para": [
      [
        "What is dimensional or volumetric weight?",
        "Carriers need to account for the physical space occupied by lightweight packages. Dimensional weight converts volume to an equivalent weight using a divisor, while actual weight is the mass shown on a scale. A carrier may base charges on the higher value, subject to its own minimums and rounding policy."
      ],
      [
        "Formula for dimensional weight",
        "For dimensions in centimetres, the calculation is length × width × height ÷ divisor, with the result expressed in kilograms. A divisor of 5,000 is used in many express-courier contexts, but not universally; another contract may use 6,000 or a different rule. This tool allows you to set the divisor rather than implying a global standard."
      ],
      [
        "Worked example with 200 cartons",
        "A 60 × 40 × 40 cm carton gives 96,000 cm³. With a divisor of 5,000, its dimensional weight is 19.2 kg. Two hundred of those cartons represent 3,840 kg of dimensional weight. If they actually weigh 25 kg each, the aggregate actual weight is 5,000 kg, higher than the aggregate dimensional estimate."
      ],
      [
        "Important billing limitations",
        "This calculator compares aggregate actual and aggregate dimensional weight; a specific carrier might round each piece separately, charge per consignment, or apply special volumetric coefficients. It does not calculate a freight price. Confirm the applicable divisor, rounding, documentation and contract terms."
      ]
    ],
    "steps": [
      "Enter carton dimensions, number of cartons and actual mass per carton.",
      "Set the volumetric divisor specified by your courier or freight carrier.",
      "Compare total dimensional weight with actual weight and confirm chargeable-weight rules with your carrier."
    ],
    "faq": [
      [
        "Is 5,000 the correct divisor for every carrier?",
        "No. It is a common example; other providers and contracts may use 6,000 or another divisor."
      ],
      [
        "Does the result include freight charges?",
        "No. It estimates weights only, not shipping prices or carrier-specific per-piece rounding."
      ]
    ]
  },
  {
    "slug": "container-capacity-calculator",
    "title": "Container Capacity Calculator – 20ft, 40ft & 40ft High Cube",
    "desc": "Compare cargo CBM against approximate 20ft, 40ft and 40ft high cube container volumes. Estimate volume utilisation and a planning-only container count.",
    "h1": "20ft and 40ft Shipping Container Capacity Calculator",
    "intro": "Check how much nominal container volume your shipment occupies and estimate a planning count at an adjustable assumed utilisation percentage.",
    "para": [
      [
        "Standard dry-container volume references",
        "Typical internal volumes are around 33.2 m³ for a 20-foot dry container, 67.7 m³ for a 40-foot dry container and 76.3 m³ for a 40-foot high cube. Published figures vary by manufacturer and equipment owner; verify the container dimensions on the actual booking."
      ],
      [
        "Calculating volume utilisation",
        "Divide your cargo CBM by the nominal internal container volume and multiply by 100. For example, 19.2 m³ represents about 57.8% of the theoretical 33.2 m³ 20-foot volume. A separate planning count uses your selected utilisation fraction—85% by default—but is not a physical packing simulation."
      ],
      [
        "Why volume alone cannot guarantee fit",
        "Pallet arrangement, carton dimensions, permissible orientation, internal protrusions, lifting equipment, door size, cargo securing, axle limits and payload restrictions may prevent an apparently suitable shipment from fitting safely. The calculated count ignores these constraints and is only a high-level estimate. Consult a freight forwarder before booking."
      ],
      [
        "Comparing the three common containers",
        "A 40-foot high cube has additional height compared with a standard 40-foot unit, but that additional space only helps if your goods can use it safely. For dense products, maximum permitted payload may matter before internal volume is exhausted."
      ]
    ],
    "steps": [
      "Enter cargo dimensions and quantities across the shipment rows.",
      "Choose a planning utilisation rate, such as 85%, rather than assuming all nominal volume is usable.",
      "Compare percentage fill and the volume-only container counts; verify real equipment dimensions and loading with a carrier."
    ],
    "faq": [
      [
        "How much CBM is in a 20ft container?",
        "A common reference is approximately 33.2 m³, although actual specifications can vary."
      ],
      [
        "Can 33 CBM of cartons always fit in a 20ft container?",
        "No. This is near the nominal internal volume and does not account for packing geometry, weight limits, pallets or clearances."
      ]
    ]
  },
  {
    "slug": "multiple-carton-cbm-calculator",
    "title": "Multiple Carton CBM Calculator – Mixed Shipment Volume",
    "desc": "Add multiple cargo lines with different dimensions, weights, units and quantities. Calculate total CBM, CFT and shipment mass, then export a CSV.",
    "h1": "Multiple Carton CBM Calculator for Mixed Shipments",
    "intro": "Combine cartons of different sizes into one shipment calculation, including total cubic metres, cubic feet and actual gross cargo weight.",
    "para": [
      [
        "Why mixed cargo needs separate calculations",
        "A shipment may contain small cartons, large crates and differently sized parcels. Taking the volume of just one carton type and multiplying by a total quantity gives the wrong answer when sizes differ. Instead, calculate length × width × height × quantity for each line, then add every line's result."
      ],
      [
        "Example of two product groups",
        "Suppose one product uses 100 cartons of 50 × 40 × 30 cm (6 m³ total), and another uses 50 cartons of 60 × 40 × 40 cm (4.8 m³ total). Together they occupy 10.8 m³, before loading gaps and pallets. Enter weights per carton to calculate the combined mass."
      ],
      [
        "Mix units without converting by hand",
        "One supplier might report centimetres and another might use inches or feet. Each Docvelio line has its own unit selector and weight-unit selector. The calculation converts dimensions and weights to metric internally before adding totals."
      ],
      [
        "Download a packing-list calculation",
        "Use the CSV export to keep item descriptions, dimensions, units, counts, line volumes and mass estimates. This is a calculation report, not a legally certified packing list or a bill of lading. Double-check the numbers against actual measurements."
      ]
    ],
    "steps": [
      "Enter the first product's dimensions, weight and quantity.",
      "Select Add cargo row for different-sized cartons; use an individual dimension unit per line.",
      "Review combined totals, adjust the divisor if needed and download the CSV summary."
    ],
    "faq": [
      [
        "Can I use centimetres and inches in one shipment?",
        "Yes. Each cargo row has its own length unit and weight unit."
      ],
      [
        "How many different product types can I enter?",
        "The calculator supports up to 100 cargo rows per calculation."
      ]
    ]
  }
];
