// Offer configuration. One entry per prospect under `prospects`.
// Open a personalized page with ?p=<key>, e.g. index.html?p=britt
// Empty fields are hidden on the page, so leave them empty instead of writing placeholders.

window.OFFER_CONFIG = {
  coach: {
    name: "Kennon",            // TODO: full name
    firm: "Quest Coaching",
    email: "",                 // TODO
    photo: ""                  // optional: path or URL to a headshot
  },

  links: {
    book: "#",                 // TODO: Calendly link for the CEO Diagnostic kickoff
    pay: "#",                  // TODO: payment link CEO Diagnostic ($2,500)
    downsellPay: "#"           // TODO: payment link Decision Rights Session ($750)
  },

  roundtable: {
    title: "Executive Roundtable on Leading Through Uncertainty",
    date: "October 15, 2026"
  },

  // Days a proposal stays valid and the credit window toward the next step
  validDays: 30,

  prospects: {
    // Used when no ?p= is given
    default: {
      firstName: "",
      fullName: "",
      title: "",
      company: "",
      attendedRoundtable: false,
      sentOn: "",              // YYYY-MM-DD, defaults to today
      situation: [],           // 2 to 3 points from the conversation, in the CEO's words
      initiative: ""           // the strategic initiative that depends on this, if named
    },

    // Sample data to rehearse with: /kennon/demo
    demo: {
      firstName: "Jordan",
      fullName: "Jordan Sample",
      title: "CEO",
      company: "Sample Logistics",
      attendedRoundtable: true,
      sentOn: "",
      situation: [
        "Most cross-functional decisions still end up on my desk.",
        "My leadership team is strong individually but slow together.",
        "We are about to expand into two new regions."
      ],
      initiative: "Expansion into two new regions in 2027"
    },

    // Britt La Chance, Premier Manufacturing: /kennon/britt (own page, britt.html)
    britt: {
      firstName: "Britt",
      fullName: "Britt La Chance",
      title: "CEO",
      company: "Premier Manufacturing",
      attendedRoundtable: true,
      sentOn: "2026-11-09",
      situation: [
        "It comes down to timing and priorities. You have quite a few things moving simultaneously.",
        "You have already begun incorporating what we learned into your leadership development program.",
        "A consistent monthly approach could fit well with what you are working toward.",
        "What matters most is practical results and measurable improvements."
      ],
      initiative: ""
    },

    // Kevin Ford, Co-operative Plating: /kennon/kevin (own page, kevin.html)
    kevin: {
      firstName: "Kevin",
      fullName: "Kevin Ford",
      title: "CEO",
      company: "Co-operative Plating",
      attendedRoundtable: false,
      sentOn: "2026-11-02",
      situation: [
        "Top line and bottom line have been up every month for more than six months.",
        "The support team has stabilized through key hires, and labor-hour billing discrepancies went from 19% to 0%.",
        "Stability and team development come first. Your monthly review is where each team presents its own area."
      ],
      initiative: "",
      phase1aPrice: "$2,500",   // Phase 1a Vision Session; Kennon can change it
      phase1bPrice: ""         // TODO: optional
    }
  }
};
