import React, { useState, useEffect, useCallback, useMemo } from 'react';

// HILFSFUNKTIONEN & KONSTANTEN
// =============================================

const cn = (...classes) => classes.filter(Boolean).join(' ');

const SWISS_CANTONS = [
  { value: "AG", label: "Aargau" }, { value: "AI", label: "Appenzell Innerrhoden" },
  { value: "AR", label: "Appenzell Ausserrhoden" }, { value: "BE", label: "Bern" },
  { value: "BL", label: "Basel-Landschaft" }, { value: "BS", label: "Basel-Stadt" },
  { value: "FR", label: "Freiburg" }, { value: "GE", label: "Genf" },
  { value: "GL", label: "Glarus" }, { value: "GR", label: "Graubünden" },
  { value: "JU", label: "Jura" }, { value: "LU", label: "Luzern" },
  { value: "NE", label: "Neuenburg" }, { value: "NW", label: "Nidwalden" },
  { value: "OW", label: "Obwalden" }, { value: "SG", label: "St. Gallen" },
  { value: "SH", label: "Schaffhausen" }, { value: "SO", label: "Solothurn" },
  { value: "SZ", label: "Schwyz" }, { value: "TG", label: "Thurgau" },
  { value: "TI", label: "Tessin" }, { value: "UR", label: "Uri" },
  { value: "VD", label: "Waadt" }, { value: "VS", label: "Wallis" },
  { value: "ZG", label: "Zug" }, { value: "ZH", label: "Zürich" }
];

const AGE_GROUPS = [
  { value: "18-25", label: "18-25 Jahre" }, { value: "26-35", label: "26-35 Jahre" },
  { value: "36-45", label: "36-45 Jahre" }, { value: "46-55", label: "46-55 Jahre" },
  { value: "56-65", label: "56-65 Jahre" }, { value: "65+", label: "65+ Jahre" }
];

const HEALTH_STATUS_OPTIONS = [
    { value: "excellent", label: "Wir sind beste Freunde" },
    { value: "good", label: "Wir kommen gut zurecht" },
    { value: "fair", label: "Es ist kompliziert" },
    { value: "poor", label: "Wir müssen dringend reden" }
];

const SERVICE_DETAILS = {
  massage: {
    stories: [
      "Du kommst nach einem langen Tag am Schreibtisch nach Hause und dein Nacken fühlt sich nicht wie ein Betonklotz an, sondern ist locker und frei.",
      "Als junge Mutter hast du kaum eine Minute für dich. Diese eine Stunde Massage pro Woche ist dein heiliger Termin, der dir die Kraft gibt, den Rest mit einem Lächeln zu meistern.",
      "Nach dem Sport am Wochenende zwickt es immer im Rücken. Eine Sportmassage hilft dir, schneller zu regenerieren und beugt Verletzungen vor."
    ],
    goodFor: ["Nacken- & Rückenschmerzen", "Stressabbau", "Kopfschmerzen", "Regeneration"],
    costs: { without: 1440, with: 300 }
  },
  acupuncture: {
    stories: [
      "Du leidest seit Jahren unter Migräne. Nach ein paar Sitzungen merkst du, wie die Anfälle seltener und weniger intensiv werden – ganz ohne starke Medikamente.",
      "Du kannst abends einfach nicht einschlafen, weil deine Gedanken kreisen. Akupunktur hilft dir, dein Nervensystem zu beruhigen und endlich wieder durchzuschlafen.",
      "Deine Heuschnupfen-Allergie macht dir jeden Frühling das Leben zur Hölle. Mit einer Akupunktur-Behandlung vor der Saison kommst du viel besser durch die Pollenzeit."
    ],
    goodFor: ["Chronische Schmerzen", "Migräne", "Schlafstörungen", "Stress", "Allergien", "Kinesiologie"],
    costs: { without: 1200, with: 250 }
  },
  physiotherapy: {
    stories: [
      "Dein Knie schmerzt beim Wandern immer. Ein Physiotherapeut zeigt dir gezielte Übungen, und nach wenigen Wochen kannst du deine Lieblingsroute wieder schmerzfrei geniessen.",
      "Du hast dir beim Fussball das Sprunggelenk verstaucht. Die Physiotherapie hilft dir nicht nur bei der Heilung, sondern zeigt dir auch, wie du solche Verletzungen in Zukunft vermeiden kannst.",
      "Du sitzt den ganzen Tag am Computer und deine Haltung wird immer schlechter. Die Physiotherapie löst nicht nur die Verspannungen, sondern gibt dir auch Übungen für den Büroalltag mit."
    ],
    goodFor: ["Sportverletzungen", "Haltungsprobleme", "Rehabilitation nach Unfall", "Gelenkschmerzen"],
    costs: { without: 1080, with: 150 }
  },
  optometry: {
    stories: [
      "Du merkst, dass deine Augen am Abend immer müde und trocken sind. Ein Sehtest ergibt, dass eine leichte Brille für die Computerarbeit deine Augen entlastet und Kopfschmerzen vorbeugt.",
      "Beim Autofahren in der Nacht fühlst du dich unsicher. Ein Optiker stellt fest, dass deine Sehstärke leicht nachgelassen hat. Mit der neuen Brille fährst du wieder entspannt und sicher.",
      "In deiner Familie gibt es Augenkrankheiten. Eine regelmässige Kontrolle beim Optiker gibt dir die Sicherheit, dass alles in Ordnung ist und mögliche Probleme früh erkannt werden."
    ],
    goodFor: ["Trockene Augen", "Kopfschmerzen bei Bildschirmarbeit", "Sehschärfe prüfen", "Vorsorge"],
    costs: { without: 300, with: 50 }
  },
  "dental-hygiene": {
    stories: [
      "Du gehst zweimal im Jahr zur Zahnreinigung. Das kostet dich weniger als ein Abendessen im Restaurant, aber du sparst dir teure Zahnarztkosten in der Zukunft und hast immer ein strahlendes Lächeln.",
      "Du trinkst gerne Kaffee und Tee, was zu Verfärbungen führt. Die Dentalhygiene lässt deine Zähne wieder weiss strahlen und gibt dir mehr Selbstvertrauen.",
      "Du hast empfindliches Zahnfleisch. Die professionelle Reinigung entfernt Zahnstein an Stellen, die du selbst nicht erreichst, und beugt so Entzündungen vor."
    ],
    goodFor: ["Kariesprophylaxe", "Gesundes Zahnfleisch", "Vorbeugung", "Zahnaufhellung"],
    costs: { without: 240, with: 80 }
  },
  psychotherapy: {
    stories: [
      "Du fühlst dich ständig überfordert und weisst nicht warum. In Gesprächen mit einem Coach lernst du, deine Stressmuster zu erkennen und findest neue Wege, um im Alltag gelassener zu bleiben.",
      "Du steckst in einer schwierigen Lebensphase und weisst nicht, wie es weitergehen soll. Ein Therapeut hilft dir, deine Gedanken zu ordnen und neue Perspektiven zu entwickeln.",
      "Du hast Flugangst und vermeidest deshalb Reisen. In wenigen Sitzungen lernst du Techniken, um mit der Angst umzugehen und kannst endlich wieder unbeschwert in den Urlaub fliegen."
    ],
    goodFor: ["Stress & Burnout", "Lebenskrisen", "Ängste", "Persönlichkeitsentwicklung", "Autogenes Training", "Kinesiologie"],
    costs: { without: 2500, with: 500 }
  },
  fitness: {
    stories: [
      "Deine Krankenkasse bezahlt dir 500 Franken an dein Fitness-Abo. Das ist die Motivation, die du gebraucht hast, um regelmässig etwas für deinen Rücken und deine Ausdauer zu tun.",
      "Du möchtest mit Yoga anfangen, aber die Kurse sind teuer. Dank des Beitrags deiner Versicherung kannst du dir einen qualitativ hochwertigen Kurs leisten.",
      "Nach einem langen Arbeitstag fehlt dir die Energie für Sport. Aber du weisst, dass du dich danach besser fühlst. Der finanzielle Beitrag hilft dir, die Hürde zu überwinden."
    ],
    goodFor: ["Rückenstärkung", "Herz-Kreislauf-Training", "Gewichtsmanagement", "Motivation"],
    costs: { without: 800, with: 300 }
  },
  "preventive-medicine": {
    stories: [
      "Du machst alle zwei Jahre einen kompletten Check-up. Dabei wird ein leichter Eisenmangel festgestellt. Mit einer einfachen Ernährungsumstellung fühlst du dich nach kurzer Zeit viel energiegeladener.",
      "In deiner Familie gibt es Herzerkrankungen. Ein regelmässiger Check-up gibt dir die Gewissheit, dass bei dir alles in Ordnung ist und du Risikofaktoren frühzeitig erkennst.",
      "Du fühlst dich gesund, möchtest aber wissen, wie du deine Gesundheit langfristig optimieren kannst. Eine umfassende Blutanalyse gibt dir wertvolle Hinweise zu Ernährung und Lebensstil."
    ],
    goodFor: ["Früherkennung", "Gesundheits-Check-up", "Blutwerte analysieren", "Risikominimierung"],
    costs: { without: 500, with: 100 }
  }
};

const HEALTH_SERVICES = [
  { id: "massage", name: "Massage", description: "Entspannung und Schmerzlinderung", icon: "💆‍♀️" },
  { id: "acupuncture", name: "Akupunktur", description: "Alternative Schmerztherapie", icon: "🧘" },
  { id: "physiotherapy", name: "Physiotherapie", description: "Bewegung und Rehabilitation", icon: "💪" },
  { id: "optometry", name: "Optometrie", description: "Sehtests und Brillen", icon: "👓" },
  { id: "dental-hygiene", name: "Dentalhygiene", description: "Professionelle Zahnreinigung", icon: "🦷" },
  { id: "psychotherapy", name: "Psychotherapie", description: "Mentale Gesundheit & Coaching", icon: "🧠" },
  { id: "fitness", name: "Fitness", description: "Fitness-Studio Beiträge", icon: "🏋️" },
  { id: "preventive-medicine", name: "Präventivmedizin", description: "Vorsorgeuntersuchungen", icon: "🩺" }
];

const SERVICE_CATALOG = [
    {
        category: "Ernährung & Lifestyle",
        items: ["Ernährungsberatung und Gewichtsmanagement", "Rauchstopp-Programme", "Ernährungs- und Gesundheits-Apps"]
    },
    {
        category: "Mentale Gesundheit & Stressmanagement",
        items: ["Stressmanagement und Resilienz", "Achtsamkeit und Meditation", "Psychische Gesundheit (präventiv/ergänzend)", "Schlaf und Erholung"]
    },
    {
        category: "Bewegung & Körperarbeit",
        items: ["Bewegung und Fitness", "Präventions- und Gesundheitskurse", "Körper- und Haltungsmethoden", "Hilfsmittel für Aktivität und Alltag"]
    },
    {
        category: "Komplementärmedizin & Manuelle Therapien",
        items: ["Massagen und manuelle Therapien", "Kinesiologie", "Osteopathie und Craniosacral-Therapie", "Chiropraktik (komplementär)", "Komplementärmedizin allgemein", "Shiatsu und weitere Berührungs-/Energiearbeit"]
    },
    {
        category: "Prävention & Check-ups",
        items: ["Präventionsimpfungen und Checks", "Zahnprävention", "Sehhilfen und Augenprävention"]
    },
    {
        category: "Familie & Spezielles",
        items: ["Schwangerschaft/Familie mit Fokus Wohlbefinden", "Wellness und Bäder/Kuren", "Telemedizin und Coaching", "Gesundheitskonto/Guthabenmodelle"]
    }
];


// UI KOMPONENTEN
// =============================================

const Card = ({ children, className }) => (
  <div className={cn("bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg p-6 sm:p-10 transition-all duration-300", className)}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled, variant = 'primary', className, as = 'button', href, target }) => {
  const baseClasses = "px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100";
  const variants = {
    primary: "bg-gradient-to-br from-blue-600 to-blue-500 text-white",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
  };
  const Tag = as;
  return (
    <Tag onClick={onClick} disabled={disabled} className={cn(baseClasses, variants[variant], className)} href={href} target={target}>
      {children}
    </Tag>
  );
};

const RadioCard = ({ id, value, checked, onChange, title, description, icon }) => (
    <label htmlFor={id} className={cn(
        "block p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105",
        checked ? "bg-blue-50 border-blue-500 shadow-lg scale-105" : "bg-white border-gray-200 hover:border-blue-300"
    )}>
        <input type="radio" id={id} name={id} value={value} checked={checked} onChange={onChange} className="hidden" />
        <div className="flex items-start space-x-4">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xl transition-all duration-300", checked ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600')}>
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    </label>
);

const CheckboxCard = ({ id, checked, onChange, title, description, icon }) => (
    <label htmlFor={id} className={cn(
        "block p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105",
        checked ? "bg-blue-50 border-blue-500 shadow-lg scale-105" : "bg-white border-gray-200 hover:border-blue-300"
    )}>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} className="hidden" />
        <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xl transition-all duration-300", checked ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600')}>
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                </div>
            </div>
            <div className={cn("w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all duration-300 mt-1", checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300')}>
                {checked && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
        </div>
    </label>
);

const ServiceStoriesModal = ({ service, onClose }) => {
    const details = SERVICE_DETAILS[service.id];
    if (!details) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 m-4 relative animate-fade-in" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-3xl bg-blue-100 text-blue-600 mr-4">{service.icon}</div>
                    <h2 className="text-3xl font-bold text-gray-900">{service.name}</h2>
                </div>
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Drei Geschichten aus dem Alltag:</h3>
                <div className="space-y-4 mb-6">
                    {details.stories.map((story, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                             <p className="italic text-gray-700">"{story}"</p>
                        </div>
                    ))}
                </div>
                 <div className="flex flex-wrap gap-2">
                    <span className="font-semibold text-sm">Gut bei:</span>
                    {details.goodFor.map(item => (
                        <span key={item} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{item}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const TimeTipsModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 m-4 relative animate-fade-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Wie du dir Zeit für dich nimmst – auch wenn du keine hast</h2>
                
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 mb-6">
                    <h3 className="font-bold text-yellow-800">Das Paradoxon der Zeit</h3>
                    <p className="text-yellow-700">Wir haben immer Zeit für einen dringenden Anruf vom Chef, für die Hausaufgaben der Kinder oder um einem Freund beim Umzug zu helfen. Aber für uns selbst? "Keine Zeit". Es ist Zeit, diese Priorität zu verschieben.</p>
                </div>

                <h3 className="font-semibold text-xl text-gray-800 mb-4">Der Mindset-Shift: Von "Zeit finden" zu "Zeit schaffen"</h3>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <h4 className="font-bold">1. Der Termin-Trick von Anna, Projektleiterin</h4>
                        <p className="italic text-gray-600">"Ich trage meine wöchentliche Physiotherapie als 'Wichtiges Meeting' in meinen Geschäftskalender ein. Niemand fragt nach, und ich nehme es genauso ernst wie ein Kundengespräch."</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <h4 className="font-bold">2. Der Energie-Tausch von David, Handwerker</h4>
                        <p className="italic text-gray-600">"Früher dachte ich, nach der Arbeit bin ich zu müde fürs Fitness. Jetzt weiss ich: Die Stunde im Gym gibt mir mehr Energie für den Feierabend zurück, als wenn ich auf dem Sofa liege."</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <h4 className="font-bold">3. Der "Mikro-Moment" von Michael, Familienvater</h4>
                        <p className="italic text-gray-600">"Ich kann mir keine zwei Stunden freinehmen. Aber ich nehme mir 15 Minuten am Morgen für meine Rückenübungen, bevor die Kinder aufwachen. Diese 15 Minuten gehören nur mir."</p>
                    </div>
                     <div className="p-4 bg-gray-50 rounded-lg border">
                        <h4 className="font-bold">4. Das "Nein" als Superkraft von Lena, Managerin</h4>
                        <p className="italic text-gray-600">"Ich habe gelernt, 'Nein' zu sagen zu Dingen, die nicht meine Priorität sind. Jedes 'Nein' zu einer unwichtigen Anfrage ist ein 'Ja' zu meiner eigenen Gesundheit."</p>
                    </div>
                </div>
                 <Button onClick={onClose} className="w-full mt-8">Ich habe es verstanden!</Button>
            </div>
        </div>
    );
};

const DonutChart = ({ percentage, size = 120 }) => {
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                <circle
                    className="text-gray-200"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="text-green-500"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
            </div>
        </div>
    );
};


const ReflectionModal = ({ premium, services, onClose }) => {
    const [usedServices, setUsedServices] = useState([]);

    const handleToggle = (id) => {
        const newSelection = usedServices.includes(id)
            ? usedServices.filter(s => s !== id)
            : [...usedServices, id];
        setUsedServices(newSelection);
    };

    const usedPotential = useMemo(() => {
        if (!premium || services.length === 0) return 0;
        const totalPotentialValue = services.reduce((sum, s) => sum + s.costs.with, 0);
        const usedValue = usedServices.reduce((sum, id) => {
            const service = services.find(s => s.id === id);
            return sum + (service ? service.costs.with : 0);
        }, 0);
        
        const percentage = Math.round((usedValue / totalPotentialValue) * 100);
        return isNaN(percentage) ? 0 : Math.min(percentage, 100);

    }, [usedServices, services, premium]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 m-4 relative animate-fade-in" onClick={e => e.stopPropagation()}>
                 <h2 className="text-2xl font-bold text-gray-900 mb-4">Ein kurzer Moment der Reflexion...</h2>
                 <p className="text-lg text-gray-700 mb-6">Du gibst ca. <span className="font-bold text-blue-600">CHF {premium}</span> pro Jahr für deine gesamte Krankenkasse aus.</p>
                 
                 <div className="grid md:grid-cols-2 gap-6 items-center mb-6">
                    <div>
                        <p className="font-semibold text-gray-800 mb-4">Welche dieser für dich wichtigen Leistungen beanspruchst du davon bereits heute?</p>
                        <div className="space-y-2">
                            {services.map(service => (
                                <label key={service.id} className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer">
                                    <input type="checkbox" checked={usedServices.includes(service.id)} onChange={() => handleToggle(service.id)} className="h-5 w-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                                    <span className="ml-3 text-gray-800">{service.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <DonutChart percentage={usedPotential} />
                        <p className="mt-2 font-semibold text-center text-gray-700">Dein genutztes<br/>Gesundheits-Potenzial</p>
                    </div>
                 </div>
                 <Button onClick={onClose} className="w-full">Weiter zur Kosten-Gegenüberstellung</Button>
            </div>
        </div>
    );
};

const AccordionItem = ({ title, items }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left font-semibold text-lg text-gray-800 hover:bg-gray-50">
                <span>{title}</span>
                <svg className={cn("w-5 h-5 transition-transform", isOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="p-4 bg-gray-50">
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {items.map(item => <li key={item}>{item}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};

const ServiceCatalogModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 m-4 relative animate-fade-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Umfassender Leistungskatalog</h2>
            <p className="text-gray-600 mb-6">Entdecke, welche Leistungen oft in Zusatzversicherungen enthalten sind und die du vielleicht schon bezahlst.</p>
            <div className="border rounded-lg overflow-hidden">
                {SERVICE_CATALOG.map(category => (
                    <AccordionItem key={category.category} title={category.category} items={category.items} />
                ))}
            </div>
            <Button onClick={onClose} className="w-full mt-8">Schliessen</Button>
        </div>
    </div>
);

const KnowledgeModal = ({ onClose, onContact }) => (
     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 sm:p-12 m-4 relative animate-fade-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Über GesundPlus</h2>
            <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-8">
                Wir helfen Menschen in der Schweiz, sich im komplexen Versicherungsdschungel zurechtzufinden. Unser Ziel ist es, Ihnen Klarheit und Sicherheit zu geben, damit Sie die bestmögliche Entscheidung für Ihre Gesundheit treffen können.
            </p>

            <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100 mb-8">
                 <h3 className="text-2xl font-bold text-gray-800 mb-2">Unsere Philosophie</h3>
                 <p className="text-xl italic text-blue-800">"Es geht nicht nur darum, eine Versicherung zu finden. Es geht darum, dich selbst und dein Potenzial zu entdecken."</p>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-8">
                **Gesundheit hat mit Vertrauen zu tun.** Wir verkaufen nicht einfach nur Versicherungen. Wir sehen uns als Ihr Partner, der Ihnen hilft, Ihre eigenen Bedürfnisse zu spüren und zu verstehen. Unsere Beratung basiert auf Ehrlichkeit und der Leidenschaft, für jeden Menschen die perfekte, massgeschneiderte Lösung zu finden. Wir möchten, dass Sie nicht nur gut versichert sind, sondern sich auch gut dabei fühlen.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-center mb-8">
                <div className="p-4">
                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600">👤</div>
                    <h4 className="font-bold text-lg">Persönlich</h4>
                    <p className="text-sm text-gray-600">Wir beraten Sie persönlich und legen Wert auf einen respektvollen Umgang.</p>
                </div>
                <div className="p-4">
                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600">💼</div>
                    <h4 className="font-bold text-lg">Professionell</h4>
                    <p className="text-sm text-gray-600">Unser Wizard übersetzt komplexe Details in verständliche Alltagsgeschichten.</p>
                </div>
                <div className="p-4">
                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600">🌱</div>
                    <h4 className="font-bold text-lg">Nachhaltig</h4>
                    <p className="text-sm text-gray-600">Wir finden Lösungen, die langfristig zu Ihnen und Ihrem Leben passen.</p>
                </div>
                 <div className="p-4">
                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600">🤝</div>
                    <h4 className="font-bold text-lg">Ehrlich</h4>
                    <p className="text-sm text-gray-600">Unsere Partnerschaft beruht auf beidseitiger Ehrlichkeit und offener Kommunikation.</p>
                </div>
                 <div className="p-4">
                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600">🧭</div>
                    <h4 className="font-bold text-lg">Orientiert</h4>
                    <p className="text-sm text-gray-600">Wir sind zertifiziert und orientieren uns stets an den besten Lösungen für Sie.</p>
                </div>
            </div>
             <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
                <Button onClick={onContact} variant="primary">Kontaktformular für Beratung</Button>
                <Button as="a" href="https://www.issever-consulting.ch" target="_blank" rel="noopener noreferrer" variant="outline">Webseite besuchen</Button>
            </div>
        </div>
    </div>
);

const ContactModal = ({ data, onClose }) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const subject = "Neue Beratungsanfrage von GesundPlus";
        const body = `
Eine neue Beratungsanfrage ist eingegangen:

Kontaktdaten:
Name: ${formData.name}
E-Mail: ${formData.email}
Telefon: ${formData.phone}
Nachricht: ${formData.message}

---

Zusammenfassung der Analyse:
Alter: ${data.age}
Kanton: ${data.canton}
Gesundheitsstatus: ${data.healthStatus}
Energie-Strategie: ${data.energyStrategy}
Stress-Wetter: ${data.stressWeather}
Alltags-Rucksack: ${data.burdens.join(', ')}
Gewünschte Leistungen: ${data.selectedServices.join(', ')}
Prioritäten: ${JSON.stringify(data.priorities, null, 2)}
        `;
        
        window.location.href = `mailto:hakan@issever-consulting.ch?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setIsSubmitted(true);
    };

    return (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 m-4 relative animate-fade-in" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                {isSubmitted ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vielen Dank!</h2>
                        <p className="text-gray-700 mb-6">Ihre Anfrage wurde übermittelt. Wir werden uns in Kürze mit Ihnen in Verbindung setzen. Ihr E-Mail-Programm sollte sich nun öffnen.</p>
                        <Button onClick={onClose}>Fenster schliessen</Button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Kostenlose Beratung anfordern</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" name="name" placeholder="Ihr Name" required onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-blue-500 transition" />
                            <input type="email" name="email" placeholder="Ihre E-Mail-Adresse" required onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-blue-500 transition" />
                            <input type="tel" name="phone" placeholder="Ihre Telefonnummer (optional)" onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-blue-500 transition" />
                            <textarea name="message" placeholder="Ihre Nachricht (optional)" rows="4" onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-blue-500 transition"></textarea>
                            <Button type="submit" className="w-full">Anfrage senden</Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};


const DetailedServiceCard = ({ service, isSelected, onToggle, onShowStories }) => {
    const details = SERVICE_DETAILS[service.id];

    return (
        <div 
            className={cn(
                "border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg",
                isSelected ? "bg-blue-50 border-blue-500 shadow-lg" : "bg-white border-gray-200 hover:border-blue-300"
            )}
            onClick={() => onToggle(service.id)}
        >
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-all duration-300", isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600')}>
                            {service.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{service.name}</h3>
                            <p className="text-gray-600 text-sm">{service.description}</p>
                        </div>
                    </div>
                    <div className={cn("w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all duration-300 mt-1", isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300')}>
                        {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                </div>
                {details && (
                     <Button 
                        onClick={(e) => { e.stopPropagation(); onShowStories(service); }} 
                        variant="outline" 
                        className="w-full mt-2"
                    >
                        Erfahre, warum das guttut
                    </Button>
                )}
            </div>
        </div>
    );
};


const ProgressIndicator = ({ currentStep, totalSteps }) => {
    const progress = (currentStep / totalSteps) * 100;
    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-700">Schritt {currentStep} von {totalSteps}</p>
                <p className="text-sm font-bold text-blue-600">{Math.round(progress)}% abgeschlossen</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

// WIZARD SCHRITTE
// =============================================

const WelcomeStep = ({ nextStep }) => (
    <div className="text-center animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Stell dir vor, du wachst morgen schmerzfrei auf...</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Was wäre, wenn du endlich herausfindest, was dein Körper und deine Seele wirklich brauchen? Nicht wegen der Versicherung – sondern weil du es verdienst, dich wohlzufühlen.
        </p>
        <Card className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Die meisten Menschen wissen nicht, was sie für ihre Gesundheit wirklich brauchen</h2>
            <p className="text-gray-600 mb-6">Wir helfen dir durch professionelle Fragen herauszufinden, was dir wirklich gut tut. Nicht weil du krank bist, sondern weil du dir ein erfülltes, schmerzfreies Leben verdienst.</p>
            <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="bg-white/50 p-4 rounded-xl border">
                    <p className="italic text-gray-700">"Ich dachte immer, Rückenschmerzen gehören halt dazu. Bis ich merkte: Eine Massage pro Woche kostet weniger als mein täglicher Kaffee – und gibt mir mein Leben zurück."</p>
                    <p className="text-sm font-semibold text-gray-500 mt-2">— Sarah, 34, endlich schmerzfrei</p>
                </div>
                <div className="bg-white/50 p-4 rounded-xl border">
                    <p className="italic text-gray-700">"Ich wusste nicht, dass Akupunktur bei Stress hilft. Jetzt schlafe ich wieder durch und stehe gerne auf. Das hätte ich mir viel früher gönnen sollen."</p>
                    <p className="text-sm font-semibold text-gray-500 mt-2">— Marco, 42, wieder voller Energie</p>
                </div>
            </div>
        </Card>
        <Button onClick={nextStep}>
            Finde deine verdiente Gesundheit
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </Button>
    </div>
);

const EnergyStep = ({ data, updateData, nextStep, prevStep }) => {
    const options = [
        { value: "sprinter", icon: "🏃", title: "Der Sprinter", description: "Ich gebe von Montag bis Freitag Vollgas und falle am Wochenende erschöpft ins Bett. Das Aufladen muss dann schnell gehen, bevor die nächste Woche startet." },
        { value: "proactive", icon: "🔌", title: "Der proaktive Lader", description: "Ich weiss, dass ich nicht bis zum Wochenende warten kann. Sport am Mittwoch oder eine Massage am Dienstagabend ist für mich kein Luxus, sondern notwendig." },
        { value: "island-seeker", icon: "🏝️", title: "Der Insel-Sucher", description: "Ich versuche, mir jeden Abend eine kleine Auszeit zu nehmen – ein Bad, ein Buch, ein kurzer Spaziergang. Das sind meine kleinen Lade-Inseln im Alltagsstress." },
        { value: "lost-cable", icon: "❓", title: "Der mit dem verlorenen Ladekabel", description: "Ehrlich gesagt, ich weiss gar nicht mehr, wo mein Ladekabel ist. Ich fühle mich ständig energielos, egal ob es Montag oder Samstag ist." },
    ];
    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">Wir leben nicht nur am Wochenende.</h2>
            <p className="text-lg text-center text-gray-600 mb-8">Wie gehst du mit deiner Energie unter der Woche um?</p>
            <div className="space-y-4 mb-8">
                {options.map(o => <RadioCard key={o.value} {...o} id={o.value} checked={data.energyStrategy === o.value} onChange={() => updateData({ energyStrategy: o.value })} />)}
            </div>
            <div className="flex justify-between">
                <Button onClick={prevStep} variant="secondary">Zurück</Button>
                <Button onClick={nextStep} disabled={!data.energyStrategy}>Weiter</Button>
            </div>
        </div>
    );
};

const StressStep = ({ data, updateData, nextStep, prevStep }) => {
    const options = [
        { value: "sunny", icon: "☀️", title: "Sonnenschein mit leichter Brise", description: "Die meisten Tage sind gut. Natürlich gibt es mal eine Wolke, aber ich weiss, dass die Sonne gleich wieder scheint. Stress perlt meistens an mir ab." },
        { value: "changeable", icon: "🌦️", title: "Wechselhaft mit gelegentlichen Schauern", description: "Meine Woche ist ein Auf und Ab. Mal scheint die Sonne, dann ziehen plötzlich dunkle Wolken auf, die mich unter Druck setzen." },
        { value: "storm", icon: "⛈️", title: "Ein heranziehendes Gewitter", description: "Ich merke richtig, wie sich der Druck aufbaut. Mein Nacken verspannt sich und die Kopfschmerzen sind wie ein Donnergrollen." },
        { value: "drizzle", icon: "🌧️", title: "Anhaltender Nieselregen", description: "Oft fühlt es sich an, als würde ein feiner, kalter Nieselregen einfach nicht aufhören. Alles ist ein bisschen anstrengender, die Freude ist gedämpft." },
    ];
    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">Stress fühlt sich für jeden anders an.</h2>
            <p className="text-lg text-center text-gray-600 mb-8">Stell dir vor, es wäre Wetter – wie ist die Vorhersage bei dir?</p>
            <div className="space-y-4 mb-8">
                {options.map(o => <RadioCard key={o.value} {...o} id={o.value} checked={data.stressWeather === o.value} onChange={() => updateData({ stressWeather: o.value })} />)}
            </div>
            <div className="flex justify-between">
                <Button onClick={prevStep} variant="secondary">Zurück</Button>
                <Button onClick={nextStep} disabled={!data.stressWeather}>Weiter</Button>
            </div>
        </div>
    );
};

const BurdenStep = ({ data, updateData, nextStep, prevStep }) => {
    const options = [
        { id: "laptop", icon: "💻", title: "Ein Laptop, der immer schwerer wird", description: "Nach acht Stunden vor dem Bildschirm spüre ich das Gewicht deutlich in Schultern und Augen." },
        { id: "tools", icon: "🛠️", title: "Schwere Werkzeuge & körperliche Anstrengung", description: "Meine Arbeit ist körperlich. Abends fühle ich mich oft 'durch' und meine Gelenke melden sich." },
        { id: "responsibility", icon: "❤️", title: "Die Verantwortung für andere", description: "Neben meinem Job trage ich die Verantwortung für meine Familie. Oft habe ich das Gefühl, der Rucksack gehört gar nicht mir." },
        { id: "sport", icon: "👟", title: "Sportschuhe und der Wille, fit zu bleiben", description: "Das ist mir wichtig, aber manchmal führt es auch zu Zerrungen oder Muskelkater." },
        { id: "mental", icon: "🧠", title: "Der unsichtbare 'mentale Ballast'", description: "Rechnungen, Termine, Planung... Mein Kopf ist ständig voll mit Dingen, die ich nicht vergessen darf." },
    ];

    const handleToggle = (id) => {
        const newBurdens = data.burdens.includes(id)
            ? data.burdens.filter(b => b !== id)
            : [...data.burdens, id];
        updateData({ burdens: newBurdens });
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">Dein Leben ist ein Rucksack.</h2>
            <p className="text-lg text-center text-gray-600 mb-8">Was trägst du jeden Tag mit dir herum? (Mehrfachauswahl möglich)</p>
            <div className="space-y-4 mb-8">
                {options.map(o => <CheckboxCard key={o.id} {...o} checked={data.burdens.includes(o.id)} onChange={() => handleToggle(o.id)} />)}
            </div>
            <div className="flex justify-between">
                <Button onClick={prevStep} variant="secondary">Zurück</Button>
                <Button onClick={nextStep} disabled={data.burdens.length === 0}>Weiter</Button>
            </div>
        </div>
    );
};

const PersonalInfoStep = ({ data, updateData, nextStep, prevStep }) => {
    const isValid = data.age && data.canton && data.healthStatus;
    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">Ein paar letzte Puzzleteile...</h2>
            <div className="space-y-6">
                <div>
                    <label className="font-semibold text-gray-700 mb-2 block">In welcher Lebensphase steckst du gerade?</label>
                    <select value={data.age} onChange={e => updateData({ age: e.target.value })} className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-blue-500 transition">
                        <option value="" disabled>Bitte wählen...</option>
                        {AGE_GROUPS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="font-semibold text-gray-700 mb-2 block">Wo in der Schweiz ist dein Nest?</label>
                    <select value={data.canton} onChange={e => updateData({ canton: e.target.value })} className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-blue-500 transition">
                        <option value="" disabled>Bitte wählen...</option>
                        {SWISS_CANTONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="font-semibold text-gray-700 mb-2 block">Wie würdest du die Beziehung zu deinem Körper beschreiben?</label>
                    <div className="space-y-2">
                        {HEALTH_STATUS_OPTIONS.map(o => (
                            <label key={o.value} className="flex items-center p-3 border-2 border-gray-200 rounded-xl bg-white has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 transition">
                                <input type="radio" name="healthStatus" value={o.value} checked={data.healthStatus === o.value} onChange={() => updateData({ healthStatus: o.value })} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                <span className="ml-3 text-gray-700">{o.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-8">
                <Button onClick={prevStep} variant="secondary">Zurück</Button>
                <Button onClick={nextStep} disabled={!isValid}>Weiter zu den Empfehlungen</Button>
            </div>
        </div>
    );
};

const RecommendationsStep = ({ data, updateData, nextStep, prevStep, showStories }) => {
    const getSmartRecommendations = useCallback(() => {
        const recs = new Set();
        if (data.stressWeather === 'storm' || data.burdens.includes('laptop')) recs.add('massage');
        if (data.energyStrategy === 'lost-cable' || data.stressWeather === 'drizzle') recs.add('preventive-medicine');
        if (data.burdens.includes('responsibility') || data.burdens.includes('mental')) recs.add('psychotherapy');
        if (data.burdens.includes('tools') || data.burdens.includes('sport')) recs.add('physiotherapy');
        if (recs.size === 0) {
            recs.add('massage');
            recs.add('preventive-medicine');
        }
        return Array.from(recs);
    }, [data]);

    useEffect(() => {
        if (data.selectedServices.length === 0) {
            updateData({ selectedServices: getSmartRecommendations() });
        }
    }, [getSmartRecommendations, updateData, data.selectedServices.length]);

    const handleToggle = (id) => {
        const newSelection = data.selectedServices.includes(id)
            ? data.selectedServices.filter(s => s !== id)
            : [...data.selectedServices, id];
        updateData({ selectedServices: newSelection });
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">Deine persönliche Entdeckungsliste</h2>
            <p className="text-lg text-center text-gray-600 mb-8">Hier sind die Leistungen, von denen wir glauben, dass sie dir guttun. Passe sie nach Belieben an.</p>
            <div className="space-y-4 mb-8">
                {HEALTH_SERVICES.map(service => (
                    <DetailedServiceCard 
                        key={service.id} 
                        service={service}
                        isSelected={data.selectedServices.includes(service.id)}
                        onToggle={handleToggle}
                        onShowStories={showStories}
                    />
                ))}
            </div>
            <div className="flex justify-between">
                <Button onClick={prevStep} variant="secondary">Zurück</Button>
                <Button onClick={nextStep} disabled={data.selectedServices.length === 0}>Prioritäten setzen</Button>
            </div>
        </div>
    );
};


const PrioritiesStep = ({ data, updateData, nextStep, prevStep }) => {
    const selectedServices = HEALTH_SERVICES.filter(s => data.selectedServices.includes(s.id));
    
    const setPriority = (id, value) => {
        updateData({ priorities: { ...data.priorities, [id]: value } });
    };

    const allPrioritiesSet = selectedServices.every(s => data.priorities[s.id]);

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">Was ist dir am wichtigsten?</h2>
            <div className="space-y-6 mb-8">
                {selectedServices.map(service => (
                    <Card key={service.id} className="p-4">
                        <h3 className="font-bold text-lg mb-3">{service.icon} {service.name}</h3>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Wenig wichtig</span>
                            <input 
                                type="range" 
                                min="1" 
                                max="5" 
                                value={data.priorities[service.id] || 3}
                                onChange={e => setPriority(service.id, parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <span className="text-sm text-gray-500">Sehr wichtig</span>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="flex justify-between">
                <Button onClick={prevStep} variant="secondary">Zurück</Button>
                <Button onClick={nextStep} disabled={!allPrioritiesSet}>Weiter</Button>
            </div>
        </div>
    );
};

const TimeStep = ({ data, nextStep, prevStep, showTimeTips }) => {
    const estimatedMonthlyHours = useMemo(() => {
        return (data.selectedServices.length * 1.5).toFixed(1);
    }, [data.selectedServices]);

    return (
        <div className="text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Wir haben Zeit für alles – nur nicht für uns selbst?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                "Keine Zeit" ist oft nur eine andere Art zu sagen: "Es ist keine Priorität". Lass uns das ändern.
            </p>
            
            <Card className="mb-8 bg-blue-50 border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Dein persönliches Gesundheits-Investment:</h3>
                <p className="text-4xl font-bold text-blue-600">{estimatedMonthlyHours} Stunden pro Monat</p>
                <p className="text-gray-600 mt-2">Das ist weniger Zeit, als die meisten von uns auf Social Media verbringen.</p>
            </Card>
            
            <div className="mb-8">
                <Button onClick={showTimeTips} variant="outline">
                    Wie gehe ich besser mit meiner Zeit um?
                </Button>
            </div>

            <p className="font-semibold text-gray-800 mb-8">Deine Gesundheit wartet nicht, bis du "irgendwann" Zeit hast. Sie schafft dir die Zeit, indem sie dir Energie und Lebensqualität schenkt.</p>
            
            <div className="flex justify-between">
                <Button onClick={prevStep} variant="secondary">Zurück</Button>
                <Button onClick={nextStep}>Ergebnisse berechnen</Button>
            </div>
        </div>
    );
};

const ResultsStep = ({ data, prevStep, showCatalog, nextStep }) => {
    const [kvgPremium, setKvgPremium] = useState(4200);
    const [vvgPremium, setVvgPremium] = useState(1800);
    const [showReflection, setShowReflection] = useState(false);
    const [showComparison, setShowComparison] = useState(false);

    const totalPremium = useMemo(() => kvgPremium + vvgPremium, [kvgPremium, vvgPremium]);

    const selectedServicesData = useMemo(() => 
        data.selectedServices.map(id => ({
            ...HEALTH_SERVICES.find(s => s.id === id),
            ...SERVICE_DETAILS[id]
        })),
    [data.selectedServices]);

    const totalCostWithout = useMemo(() => 
        selectedServicesData.reduce((sum, s) => sum + s.costs.without, 0),
    [selectedServicesData]);
    
    const totalCostWith = useMemo(() => 
        selectedServicesData.reduce((sum, s) => sum + s.costs.with, 0),
    [selectedServicesData]);

    const handleContinue = () => {
        setShowReflection(true);
    };
    
    const handleCloseReflection = () => {
        setShowReflection(false);
        setShowComparison(true);
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Dein Geld, deine Gesundheit.</h2>
            
            {!showComparison && (
                <Card className="mb-8 text-center">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="kvg-input" className="block text-lg font-semibold text-gray-800 mb-4">Deine Grundversicherung (KVG) pro Jahr?</label>
                            <div className="flex justify-center items-center gap-2">
                                <span className="text-2xl font-bold text-blue-600">CHF</span>
                                <input id="kvg-input" type="number" step="100" value={kvgPremium} onChange={e => setKvgPremium(parseInt(e.target.value))} className="text-center text-2xl font-bold text-blue-600 bg-gray-100 rounded-lg p-2 w-40 border-2 border-transparent focus:border-blue-500 focus:outline-none" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="vvg-input" className="block text-lg font-semibold text-gray-800 mb-4">Deine Zusatzversicherung (VVG) pro Jahr?</label>
                             <div className="flex justify-center items-center gap-2">
                                <span className="text-2xl font-bold text-blue-600">CHF</span>
                                <input id="vvg-input" type="number" step="50" value={vvgPremium} onChange={e => setVvgPremium(parseInt(e.target.value))} className="text-center text-2xl font-bold text-blue-600 bg-gray-100 rounded-lg p-2 w-40 border-2 border-transparent focus:border-blue-500 focus:outline-none" />
                            </div>
                        </div>
                    </div>
                    <Button onClick={handleContinue} className="mt-8">Weiter</Button>
                </Card>
            )}

            {showReflection && <ReflectionModal premium={totalPremium} services={selectedServicesData} onClose={handleCloseReflection} />}
            
            {showComparison && (
                <div className="animate-fade-in">
                    <p className="text-center text-lg text-gray-700 mb-8">
                        Mit der richtigen Versicherung kannst du dein Geld nutzen, um dir all das zu leisten:
                    </p>
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Kosten-Gegenüberstellung (geschätzte Jahreskosten)</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-2 font-semibold">Behandlung</th>
                                        <th className="p-2 font-semibold text-right text-red-600">Ohne Versicherung</th>
                                        <th className="p-2 font-semibold text-right text-green-600">Mit der richtigen VVG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedServicesData.map(service => (
                                        <tr key={service.id} className="border-b last:border-b-0">
                                            <td className="p-2 font-medium">{service.name}</td>
                                            <td className="p-2 text-right text-red-600">CHF {service.costs.without}</td>
                                            <td className="p-2 text-right text-green-600">CHF {service.costs.with}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-bold border-t-2">
                                        <td className="p-2">Total</td>
                                        <td className="p-2 text-right text-red-600">CHF {totalCostWithout}</td>
                                        <td className="p-2 text-right text-green-600">CHF {totalCostWith}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </Card>
                    <div className="text-center mt-8">
                        <Button onClick={showCatalog} variant="primary" className="animate-pulse">
                           Noch mehr Leistungen entdecken, die du vielleicht schon bezahlst, aber nicht nutzt
                        </Button>
                    </div>
                </div>
            )}

             <div className="flex justify-between mt-8">
                <Button onClick={prevStep} variant="secondary">Zurück</Button>
                <Button onClick={nextStep} variant="primary" disabled={!showComparison}>Kostenlose Beratung anfordern</Button>
            </div>
        </div>
    );
};

const ContactStep = ({ data, prevStep }) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const subject = "Neue Beratungsanfrage von GesundPlus";
        const body = `
Eine neue Beratungsanfrage ist eingegangen:

Kontaktdaten:
Name: ${formData.name}
E-Mail: ${formData.email}
Telefon: ${formData.phone}
Nachricht: ${formData.message}

---

Zusammenfassung der Analyse:
Alter: ${data.age}
Kanton: ${data.canton}
Gesundheitsstatus: ${data.healthStatus}
Energie-Strategie: ${data.energyStrategy}
Stress-Wetter: ${data.stressWeather}
Alltags-Rucksack: ${data.burdens.join(', ')}
Gewünschte Leistungen: ${data.selectedServices.join(', ')}
Prioritäten: ${JSON.stringify(data.priorities, null, 2)}
        `;
        
        window.location.href = `mailto:hakan@issever-consulting.ch?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="text-center animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Vielen Dank!</h2>
                <p className="text-gray-700 mb-6">Ihr E-Mail-Programm sollte sich nun öffnen, um die Anfrage zu senden. Wir werden uns in Kürze mit Ihnen in Verbindung setzen.</p>
                <Button onClick={() => window.location.reload()}>Zur Startseite</Button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Kostenlose & unverbindliche Beratung</h2>
            <p className="text-center text-gray-600 mb-8">Ein letzter Schritt, um Ihre persönliche Gesundheits-Revolution zu starten. Wir analysieren Ihre Angaben und melden uns mit konkreten Vorschlägen.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Ihr Name" required onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-blue-500 transition" />
                <input type="email" name="email" placeholder="Ihre E-Mail-Adresse" required onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-blue-500 transition" />
                <input type="tel" name="phone" placeholder="Ihre Telefonnummer (optional)" onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-blue-500 transition" />
                <textarea name="message" placeholder="Ihre Nachricht (optional)" rows="4" onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-blue-500 transition"></textarea>
                <div className="flex justify-between mt-8">
                    <Button onClick={prevStep} variant="secondary">Zurück</Button>
                    <Button type="submit" variant="primary">Anfrage senden</Button>
                </div>
            </form>
        </div>
    );
};


// HAUPTANWENDUNG
// =============================================

export default function App() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 10;
    const [wizardData, setWizardData] = useState({
        energyStrategy: '',
        stressWeather: '',
        burdens: [],
        age: '',
        canton: '',
        healthStatus: '',
        selectedServices: [],
        priorities: {},
    });
    const [storyModalService, setStoryModalService] = useState(null);
    const [timeTipsModalVisible, setTimeTipsModalVisible] = useState(false);
    const [isCatalogVisible, setIsCatalogVisible] = useState(false);
    const [isKnowledgeModalVisible, setIsKnowledgeModalVisible] = useState(false);
    const [isContactModalVisible, setIsContactModalVisible] = useState(false);


    const updateData = (update) => {
        setWizardData(prev => ({ ...prev, ...update }));
    };

    const nextStep = () => setCurrentStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));
    
    const renderStep = () => {
        const props = { data: wizardData, updateData, nextStep, prevStep };
        switch (currentStep) {
            case 1: return <WelcomeStep nextStep={nextStep} />;
            case 2: return <EnergyStep {...props} />;
            case 3: return <StressStep {...props} />;
            case 4: return <BurdenStep {...props} />;
            case 5: return <PersonalInfoStep {...props} />;
            case 6: return <RecommendationsStep {...props} showStories={setStoryModalService} />;
            case 7: return <PrioritiesStep {...props} />;
            case 8: return <TimeStep {...props} showTimeTips={() => setTimeTipsModalVisible(true)} />;
            case 9: return <ResultsStep {...props} showCatalog={() => setIsCatalogVisible(true)} />;
            case 10: return <ContactStep {...props} />;
            default: return <WelcomeStep nextStep={nextStep} />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            <style>{`
                .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
                .animate-fade-in-fast { animation: fadeIn 0.3s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .7; } }
            `}</style>
            <header className="p-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                         <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                           <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </div>
                        <span className="font-bold text-2xl text-gray-800">GesundPlus</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-600 flex items-center space-x-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        <span>Sicher & Vertrauenswürdig</span>
                    </div>
                </div>
            </header>
            <main className="max-w-3xl mx-auto p-4 sm:p-6">
                <Card>
                    {currentStep > 1 && <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />}
                    {renderStep()}
                </Card>
            </main>
            {storyModalService && <ServiceStoriesModal service={storyModalService} onClose={() => setStoryModalService(null)} />}
            {timeTipsModalVisible && <TimeTipsModal onClose={() => setTimeTipsModalVisible(false)} />}
            {isCatalogVisible && <ServiceCatalogModal onClose={() => setIsCatalogVisible(false)} />}
            {isKnowledgeModalVisible && <KnowledgeModal onClose={() => setIsKnowledgeModalVisible(false)} onContact={() => { setIsKnowledgeModalVisible(false); setIsContactModalVisible(true); }} />}
            {isContactModalVisible && <ContactModal data={wizardData} onClose={() => setIsContactModalVisible(false)} />}
            <footer className="text-center p-4 text-sm text-gray-500 mt-8">
                <p>© 2025 GesundPlus - Alle Rechte vorbehalten.</p>
                <div className="mt-4 flex justify-center">
                    <Button variant="secondary" onClick={() => setIsKnowledgeModalVisible(true)}>Mehr Wissen</Button>
                </div>
            </footer>
        </div>
    );
}
