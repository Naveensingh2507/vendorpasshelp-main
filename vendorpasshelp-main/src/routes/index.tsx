import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";

export const Route = createFileRoute("/")({
  component: VendorPassApp,
});

// ============================================================
// HARDCODED DUMMY DATA — edit here
// ============================================================
type Vendor = {
  id: string;
  name: string;
  nameHi: string;
  business: string;
  businessHi: string;
  location: string;
  locationHi: string;
  avatar: string;
  digitalFootprint: number;
  socialVouch: number;
  connections: { name: string; nameHi: string }[];
};

const INITIAL_VENDORS: Vendor[] = [
  {
    id: "v1", name: "Ramesh Kumar", nameHi: "रमेश कुमार",
    business: "Tea & Snacks Stall", businessHi: "चाय और नाश्ता स्टॉल",
    location: "Jodhpur", locationHi: "जोधपुर", avatar: "RK",
    digitalFootprint: 85, socialVouch: 90,
    connections: [
      { name: "Sharma Wholesale", nameHi: "शर्मा होलसेल" },
      { name: "Gupta Dairy Co.", nameHi: "गुप्ता डेयरी कंपनी" },
      { name: "Jodhpur Tea Traders", nameHi: "जोधपुर टी ट्रेडर्स" },
    ],
  },
  {
    id: "v2", name: "Sunita Sharma", nameHi: "सुनीता शर्मा",
    business: "Vegetable Cart", businessHi: "सब्जी की गाड़ी",
    location: "Jaipur", locationHi: "जयपुर", avatar: "SS",
    digitalFootprint: 70, socialVouch: 60,
    connections: [
      { name: "Mandi Fresh Supply", nameHi: "मंडी फ्रेश सप्लाई" },
      { name: "Krishi Farmers Co-op", nameHi: "कृषि किसान सहकारी" },
    ],
  },
  {
    id: "v3", name: "Amit Verma", nameHi: "अमित वर्मा",
    business: "Mobile Repair Kiosk", businessHi: "मोबाइल रिपेयर किओस्क",
    location: "Lucknow", locationHi: "लखनऊ", avatar: "AV",
    digitalFootprint: 48, socialVouch: 35,
    connections: [{ name: "TechParts Hub", nameHi: "टेकपार्ट्स हब" }],
  },
  {
    id: "v4", name: "Priya Devi", nameHi: "प्रिया देवी",
    business: "Flower Stall", businessHi: "फूल की दुकान",
    location: "Varanasi", locationHi: "वाराणसी", avatar: "PD",
    digitalFootprint: 78, socialVouch: 82,
    connections: [
      { name: "Ganga Flowers Wholesale", nameHi: "गंगा फूल होलसेल" },
      { name: "Banaras Garland Co.", nameHi: "बनारस माला कंपनी" },
    ],
  },
  {
    id: "v5", name: "Mohan Lal", nameHi: "मोहन लाल",
    business: "Street Food Cart", businessHi: "स्ट्रीट फूड कार्ट",
    location: "Delhi", locationHi: "दिल्ली", avatar: "ML",
    digitalFootprint: 55, socialVouch: 45,
    connections: [{ name: "Delhi Spice Mart", nameHi: "दिल्ली स्पाइस मार्ट" }],
  },
];

// ============================================================
// I18N
// ============================================================
type Lang = "en" | "hi";
const T = {
  appName: { en: "VendorPass", hi: "वेंडरपास" },
  tagline: { en: "Trust Network", hi: "ट्रस्ट नेटवर्क" },
  vendor: { en: "Vendor", hi: "वेंडर" },
  supplier: { en: "Supplier", hi: "सप्लायर" },
  bank: { en: "Bank", hi: "बैंक" },
  trustScore: { en: "Trust Score", hi: "ट्रस्ट स्कोर" },
  outOf: { en: "out of 100", hi: "100 में से" },
  digitalFootprint: { en: "Digital Footprint", hi: "डिजिटल फुटप्रिंट" },
  digitalSub: { en: "Stable orders & utility payments", hi: "स्थिर ऑर्डर और यूटिलिटी भुगतान" },
  socialVouch: { en: "Social Vouch Network", hi: "सोशल वाउच नेटवर्क" },
  socialSub: { en: "trusted suppliers vouching", hi: "विश्वसनीय सप्लायर वाउच कर रहे हैं" },
  verifiedConnections: { en: "Verified Connections", hi: "सत्यापित कनेक्शन" },
  generateVouch: { en: "Generate Vouch Request", hi: "वाउच रिक्वेस्ट जनरेट करें" },
  showQr: { en: "Show this to your supplier to request a vouch", hi: "वाउच का अनुरोध करने के लिए इसे अपने सप्लायर को दिखाएं" },
  close: { en: "Close", hi: "बंद करें" },
  selectVendor: { en: "Profile", hi: "प्रोफ़ाइल" },
  addingToNetwork: { en: "You are adding", hi: "आप जोड़ रहे हैं" },
  toNetwork: { en: "to your trade network", hi: "अपने ट्रेड नेटवर्क में" },
  howLong: { en: "How long have you supplied this business?", hi: "आप इस व्यवसाय को कितने समय से सप्लाई कर रहे हैं?" },
  lt1: { en: "< 1 year", hi: "1 वर्ष से कम" },
  oneToThree: { en: "1-3 years", hi: "1-3 वर्ष" },
  threePlus: { en: "3+ years", hi: "3+ वर्ष" },
  highlyReliable: { en: "Mark as Highly Reliable Trader", hi: "अत्यधिक विश्वसनीय व्यापारी के रूप में चिह्नित करें" },
  warning: {
    en: "This creates a reputation link — your trust tier is connected to this vendor's future performance.",
    hi: "यह एक प्रतिष्ठा लिंक बनाता है — आपका विश्वास स्तर इस वेंडर के भविष्य के प्रदर्शन से जुड़ा है।",
  },
  signEndorsement: { en: "Sign Digital Endorsement", hi: "डिजिटल समर्थन पर हस्ताक्षर करें" },
  endorsed: { en: "Endorsement Signed", hi: "समर्थन पर हस्ताक्षर किए गए" },
  endorsedMsg: { en: "Your vouch has been added to the vendor's Trust Network.", hi: "आपका वाउच वेंडर के ट्रस्ट नेटवर्क में जोड़ दिया गया है।" },
  searchVendors: { en: "Search vendors...", hi: "वेंडर खोजें..." },
  minTrustScore: { en: "Minimum Trust Score", hi: "न्यूनतम ट्रस्ट स्कोर" },
  conns: { en: "connections", hi: "कनेक्शन" },
  connect: { en: "Invite", hi: "आमंत्रित" },
  invited: { en: "Invitation sent", hi: "निमंत्रण भेजा गया" },
  vouchRequest: { en: "Vouch Request", hi: "वाउच अनुरोध" },
  resultsFound: { en: "matching vendors", hi: "मेल खाते वेंडर" },
  done: { en: "Done", hi: "पूर्ण" },
  verified: { en: "Verified", hi: "सत्यापित" },
  passportId: { en: "Passport ID", hi: "पासपोर्ट आईडी" },
  issuedBy: { en: "Issued by VendorPass Trust Network", hi: "वेंडरपास ट्रस्ट नेटवर्क द्वारा जारी" },
  dualEngine: { en: "Dual-Engine Score", hi: "ड्यूल-इंजन स्कोर" },
  weight60: { en: "60% weight", hi: "60% वज़न" },
  weight40: { en: "40% weight", hi: "40% वज़न" },
  discovery: { en: "Discovery Terminal", hi: "डिस्कवरी टर्मिनल" },
  discoverySub: { en: "Find vendors meeting your trust threshold", hi: "अपनी विश्वास सीमा को पूरा करने वाले वेंडर खोजें" },
  endorse: { en: "Endorse a Vendor", hi: "वेंडर का समर्थन करें" },
  endorseSub: { en: "Add reputation backing to a vendor in your supply chain", hi: "अपनी आपूर्ति श्रृंखला में किसी वेंडर को प्रतिष्ठा समर्थन जोड़ें" },
};
const t = (key: keyof typeof T, lang: Lang) => T[key][lang];

// ============================================================
// MAIN APP
// ============================================================
function VendorPassApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [tab, setTab] = useState<"vendor" | "supplier" | "bank">("vendor");
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [selectedVendorId, setSelectedVendorId] = useState("v1");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId)!;

  const endorseVendor = (vendorId: string, supplierName: string, supplierNameHi: string) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id !== vendorId) return v;
        const newSocial = Math.min(100, v.socialVouch + 5);
        const already = v.connections.some((c) => c.name === supplierName);
        return {
          ...v,
          socialVouch: newSocial,
          connections: already
            ? v.connections
            : [...v.connections, { name: supplierName, nameHi: supplierNameHi }],
        };
      })
    );
  };

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-canvas/85 backdrop-blur-xl border-b border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo />
            <div className="leading-tight">
              <div className="font-display font-bold text-ink text-[15px] tracking-tight">{t("appName", lang)}</div>
              <div className="text-[10px] text-ink-muted uppercase tracking-[0.14em]">{t("tagline", lang)}</div>
            </div>
          </div>
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-line text-xs font-medium hover:border-brand transition-colors shadow-soft"
            aria-label="Toggle language"
          >
            <span className={lang === "en" ? "text-brand-deep font-semibold" : "text-ink-muted"}>EN</span>
            <span className="text-line">/</span>
            <span className={lang === "hi" ? "text-brand-deep font-semibold" : "text-ink-muted"}>हिन्दी</span>
          </button>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-3">
          <div className="inline-grid grid-cols-3 bg-surface rounded-full p-1 border border-line shadow-soft w-full sm:w-auto">
            {(["vendor", "supplier", "bank"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`py-2 px-5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  tab === k
                    ? "bg-brand-deep text-gold-soft shadow-soft"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {t(k, lang)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
        {tab === "vendor" && (
          <VendorScreen
            lang={lang}
            vendors={vendors}
            selectedVendor={selectedVendor}
            onSelectVendor={setSelectedVendorId}
          />
        )}
        {tab === "supplier" && (
          <SupplierScreen
            lang={lang}
            vendors={vendors}
            onEndorse={(id) => endorseVendor(id, "Verified Supplier #4", "सत्यापित सप्लायर #4")}
          />
        )}
        {tab === "bank" && (
          <BankScreen lang={lang} vendors={vendors} onConnect={() => setToast(t("invited", lang))} />
        )}
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-brand-deep text-gold-soft px-5 py-3 rounded-full shadow-lift text-sm font-medium flex items-center gap-2">
            <CheckIcon /> {toast}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SCREEN 1: VENDOR PASSPORT (BENTO)
// ============================================================
function VendorScreen({
  lang, vendors, selectedVendor, onSelectVendor,
}: {
  lang: Lang; vendors: Vendor[]; selectedVendor: Vendor; onSelectVendor: (id: string) => void;
}) {
  const [showQr, setShowQr] = useState(false);
  const trustScore = Math.round(
    selectedVendor.digitalFootprint * 0.6 + selectedVendor.socialVouch * 0.4
  );

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Profile switcher */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10px] text-ink-muted uppercase tracking-[0.16em] font-semibold">
          {t("selectVendor", lang)}
        </div>
        <div className="flex gap-1.5 p-1 bg-surface rounded-full border border-line shadow-soft">
          {vendors.slice(0, 3).map((v) => (
            <button
              key={v.id}
              onClick={() => onSelectVendor(v.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                v.id === selectedVendor.id
                  ? "bg-brand-soft text-brand-deep"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {v.avatar}
            </button>
          ))}
        </div>
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-6 gap-3 sm:gap-4">
        {/* Passport header — full width */}
        <div className="col-span-6 card-elevated p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--brand-deep) 1px, transparent 0)", backgroundSize: "20px 20px" }} />
          <div className="absolute top-4 right-5 text-[9px] font-mono text-gold-deep tracking-[0.2em] uppercase opacity-70">
            {t("issuedBy", lang)}
          </div>
          <div className="relative flex items-center gap-4 mt-4 sm:mt-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-brand-deep to-brand grid place-items-center text-gold-soft font-display font-bold text-2xl shadow-lift ring-2 ring-gold/40 ring-offset-2 ring-offset-surface">
              {selectedVendor.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-bold text-ink text-xl sm:text-2xl leading-tight">
                  {lang === "en" ? selectedVendor.name : selectedVendor.nameHi}
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-deep bg-brand-soft px-2 py-0.5 rounded-full">
                  <CheckIcon size={10} /> {t("verified", lang)}
                </span>
              </div>
              <div className="text-sm text-ink-muted mt-0.5">
                {lang === "en" ? selectedVendor.business : selectedVendor.businessHi}
              </div>
              <div className="text-xs text-ink-muted mt-1 flex items-center gap-1.5">
                <PinIcon /> {lang === "en" ? selectedVendor.location : selectedVendor.locationHi}
                <span className="text-line">·</span>
                <span className="font-mono">VP-{selectedVendor.id.toUpperCase()}-2026</span>
              </div>
            </div>
          </div>
          <div className="hairline-gold mt-5" />
        </div>

        {/* Trust Score gauge — large tile */}
        <div className="col-span-6 sm:col-span-3 card-base p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-3 left-4 text-[10px] uppercase tracking-[0.16em] font-semibold text-ink-muted">
            {t("dualEngine", lang)}
          </div>
          <TrustGauge score={trustScore} lang={lang} />
        </div>

        {/* Right column: two stacked tiles */}
        <div className="col-span-6 sm:col-span-3 grid grid-rows-2 gap-3 sm:gap-4">
          <MetricTile
            label={t("digitalFootprint", lang)}
            sub={t("digitalSub", lang)}
            value={selectedVendor.digitalFootprint}
            weight={t("weight60", lang)}
            tone="brand"
            icon={<ChipIcon />}
          />
          <MetricTile
            label={t("socialVouch", lang)}
            sub={`${selectedVendor.connections.length} ${t("socialSub", lang)}`}
            value={selectedVendor.socialVouch}
            weight={t("weight40", lang)}
            tone="gold"
            icon={<LinkIcon />}
          />
        </div>

        {/* Connections — wide */}
        <div className="col-span-6 sm:col-span-4 card-base p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-ink uppercase tracking-[0.12em] flex items-center gap-2">
              <span className="w-1 h-3 bg-brand-deep rounded-full" />
              {t("verifiedConnections", lang)}
            </h3>
            <span className="text-xs text-ink-muted font-mono">{selectedVendor.connections.length}</span>
          </div>
          <ul className="space-y-1.5">
            {selectedVendor.connections.map((c, i) => (
              <li
                key={i}
                className="flex items-center gap-3 bg-canvas rounded-xl px-3 py-2.5 border border-line"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-deep grid place-items-center text-gold-soft shrink-0">
                  <CheckIcon />
                </div>
                <span className="text-sm font-medium text-ink flex-1 truncate">
                  {lang === "en" ? c.name : c.nameHi}
                </span>
                <span className="text-[10px] text-ink-muted font-mono">#{i + 1}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA tile */}
        <button
          onClick={() => setShowQr(true)}
          className="col-span-6 sm:col-span-2 card-base p-5 text-left bg-brand-deep text-gold-soft border-brand-deep hover:opacity-95 active:scale-[0.99] transition-all group flex flex-col justify-between min-h-[140px]"
        >
          <div className="w-9 h-9 rounded-xl bg-gold/20 grid place-items-center text-gold">
            <QrIconSmall />
          </div>
          <div>
            <div className="font-display font-semibold text-base leading-tight">
              {t("generateVouch", lang)}
            </div>
            <div className="text-[11px] text-gold-soft/70 mt-1 flex items-center gap-1">
              {t("vouchRequest", lang)} <ArrowIcon />
            </div>
          </div>
        </button>
      </div>

      {showQr && (
        <Modal onClose={() => setShowQr(false)}>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.16em] text-ink-muted font-semibold">
              {t("vouchRequest", lang)}
            </div>
            <h3 className="font-display font-bold text-ink text-xl mt-1 mb-1">
              {lang === "en" ? selectedVendor.name : selectedVendor.nameHi}
            </h3>
            <p className="text-sm text-ink-muted mb-5">{t("showQr", lang)}</p>
            <div className="mx-auto w-56 h-56 bg-surface border border-line rounded-2xl p-3 shadow-soft">
              <QrPattern />
            </div>
            <div className="mt-4 text-xs text-ink-muted font-mono tracking-wider">
              VP-{selectedVendor.id.toUpperCase()}-
              {Math.random().toString(36).slice(2, 8).toUpperCase()}
            </div>
            <button
              onClick={() => setShowQr(false)}
              className="mt-5 w-full py-3 rounded-xl bg-ink text-gold-soft font-medium"
            >
              {t("close", lang)}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function MetricTile({
  label, sub, value, weight, tone, icon,
}: {
  label: string; sub: string; value: number; weight: string;
  tone: "brand" | "gold"; icon: React.ReactNode;
}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setW(value), 60);
    return () => clearTimeout(id);
  }, [value]);
  const bar = tone === "brand"
    ? "bg-gradient-to-r from-brand to-brand-deep"
    : "bg-gradient-to-r from-gold to-warn-deep";
  const chip = tone === "brand"
    ? "bg-brand-soft text-brand-deep"
    : "bg-gold-soft text-warn-deep";
  return (
    <div className="card-base p-4 flex flex-col justify-between min-h-[120px]">
      <div className="flex items-start justify-between gap-2">
        <div className={`w-8 h-8 rounded-lg grid place-items-center ${chip}`}>{icon}</div>
        <span className={`text-[9px] uppercase tracking-[0.14em] font-semibold px-1.5 py-0.5 rounded ${chip}`}>
          {weight}
        </span>
      </div>
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-xs font-semibold text-ink leading-tight">{label}</div>
          <div className="font-display font-bold text-lg text-ink tabular-nums">{value}<span className="text-xs text-ink-muted">%</span></div>
        </div>
        <div className="text-[10px] text-ink-muted mt-0.5 truncate">{sub}</div>
        <div className="h-1.5 bg-canvas rounded-full overflow-hidden border border-line mt-2">
          <div className={`h-full ${bar} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${w}%` }} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN 2: SUPPLIER VERIFICATION
// ============================================================
function SupplierScreen({
  lang, vendors, onEndorse,
}: {
  lang: Lang; vendors: Vendor[]; onEndorse: (id: string) => void;
}) {
  const [vendorId, setVendorId] = useState(vendors[0].id);
  const [duration, setDuration] = useState("1-3");
  const [reliable, setReliable] = useState(false);
  const [signed, setSigned] = useState(false);
  const vendor = vendors.find((v) => v.id === vendorId)!;

  const sign = () => {
    onEndorse(vendorId);
    setSigned(true);
  };

  return (
    <div className="space-y-4 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h2 className="font-display font-bold text-ink text-2xl">{t("endorse", lang)}</h2>
        <p className="text-sm text-ink-muted mt-0.5">{t("endorseSub", lang)}</p>
      </div>

      {/* Context card */}
      <div className="card-elevated p-5 relative overflow-hidden">
        <div className="text-[10px] uppercase tracking-[0.16em] text-ink-muted font-semibold mb-3">
          {t("addingToNetwork", lang)}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-deep to-brand grid place-items-center text-gold-soft font-display font-bold shadow-soft ring-1 ring-gold/40">
            {vendor.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <select
              value={vendorId}
              onChange={(e) => { setVendorId(e.target.value); setSigned(false); }}
              className="w-full bg-canvas border border-line rounded-lg px-2 py-1.5 text-ink font-display font-semibold text-base focus:outline-none focus:border-brand"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{lang === "en" ? v.name : v.nameHi}</option>
              ))}
            </select>
            <div className="text-xs text-ink-muted mt-1">
              {lang === "en" ? vendor.business : vendor.businessHi} · {t("toNetwork", lang)}
            </div>
          </div>
        </div>
      </div>

      {/* Bento grid for inputs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="col-span-2 card-base p-5">
          <label className="block text-xs font-semibold text-ink uppercase tracking-[0.12em] mb-3">
            {t("howLong", lang)}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "<1", k: "lt1" as const },
              { v: "1-3", k: "oneToThree" as const },
              { v: "3+", k: "threePlus" as const },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => setDuration(opt.v)}
                className={`py-3 rounded-xl text-sm font-medium transition-all border ${
                  duration === opt.v
                    ? "bg-brand-deep border-brand-deep text-gold-soft shadow-soft"
                    : "bg-canvas border-line text-ink-muted hover:border-brand/40"
                }`}
              >
                {t(opt.k, lang)}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2 card-base p-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-ink uppercase tracking-[0.12em]">
              {t("highlyReliable", lang)}
            </div>
            <div className="text-[11px] text-ink-muted mt-1">+ premium tier weighting</div>
          </div>
          <button
            onClick={() => setReliable(!reliable)}
            className={`relative w-14 h-8 rounded-full transition-colors shrink-0 ${reliable ? "bg-brand-deep" : "bg-line"}`}
            aria-pressed={reliable}
          >
            <span className={`absolute top-1 w-6 h-6 rounded-full bg-surface shadow-lift transition-all ${reliable ? "left-7" : "left-1"}`} />
          </button>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-warn-soft border border-gold/40 rounded-2xl p-4 flex gap-3">
        <div className="text-warn-deep shrink-0 mt-0.5"><WarnIcon /></div>
        <div className="text-sm text-warn-deep leading-relaxed">{t("warning", lang)}</div>
      </div>

      {!signed ? (
        <button
          onClick={sign}
          className="w-full py-4 rounded-2xl bg-brand-deep text-gold-soft font-display font-semibold shadow-lift hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <PenIcon /> {t("signEndorsement", lang)}
        </button>
      ) : (
        <div className="card-elevated p-6 text-center animate-scale-in border-brand/30">
          <div className="w-16 h-16 mx-auto rounded-full bg-brand-deep grid place-items-center text-gold-soft mb-3 shadow-lift ring-2 ring-gold/40 ring-offset-2 ring-offset-surface">
            <CheckIcon size={28} />
          </div>
          <div className="font-display font-bold text-ink text-lg">{t("endorsed", lang)}</div>
          <div className="text-sm text-ink-muted mt-1">{t("endorsedMsg", lang)}</div>
          <button
            onClick={() => setSigned(false)}
            className="mt-4 px-5 py-2 rounded-xl bg-canvas border border-line text-ink font-medium text-sm"
          >
            {t("done", lang)}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SCREEN 3: BANK DISCOVERY
// ============================================================
function BankScreen({
  lang, vendors, onConnect,
}: {
  lang: Lang; vendors: Vendor[]; onConnect: () => void;
}) {
  const [minScore, setMinScore] = useState(0);
  const [search, setSearch] = useState("");

  const enriched = useMemo(
    () =>
      vendors
        .map((v) => ({ ...v, score: Math.round(v.digitalFootprint * 0.6 + v.socialVouch * 0.4) }))
        .sort((a, b) => b.score - a.score),
    [vendors]
  );

  const filtered = enriched.filter((v) => {
    const matchesScore = v.score >= minScore;
    const matchesSearch =
      !search ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.nameHi.includes(search);
    return matchesScore && matchesSearch;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="font-display font-bold text-ink text-2xl">{t("discovery", lang)}</h2>
        <p className="text-sm text-ink-muted mt-0.5">{t("discoverySub", lang)}</p>
      </div>

      {/* Filter bento */}
      <div className="grid grid-cols-6 gap-3 sm:gap-4">
        <div className="col-span-6 sm:col-span-4 card-base p-4">
          <label className="text-[10px] uppercase tracking-[0.16em] font-semibold text-ink-muted">Search</label>
          <div className="flex items-center gap-2 mt-1.5">
            <SearchIcon />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchVendors", lang)}
              className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none py-1"
            />
          </div>
        </div>
        <div className="col-span-6 sm:col-span-2 card-base p-4 bg-brand-deep text-gold-soft border-brand-deep">
          <div className="text-[10px] uppercase tracking-[0.16em] font-semibold opacity-80">{t("resultsFound", lang)}</div>
          <div className="font-display font-bold text-3xl mt-1 tabular-nums">{filtered.length}</div>
        </div>
        <div className="col-span-6 card-base p-5">
          <div className="flex justify-between items-baseline mb-2">
            <label className="text-xs font-semibold text-ink uppercase tracking-[0.12em]">{t("minTrustScore", lang)}</label>
            <span className="font-display font-bold text-2xl text-brand-deep tabular-nums">{minScore}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full accent-brand-deep"
          />
          <div className="flex justify-between text-[10px] text-ink-muted mt-1 font-mono">
            <span>0</span><span>50</span><span>100</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((v) => (
          <div
            key={v.id}
            className="card-base p-4 flex items-center gap-3 animate-fade-in hover:shadow-lift transition-shadow"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-deep to-brand grid place-items-center text-gold-soft font-display font-bold text-sm shrink-0 ring-1 ring-gold/30">
              {v.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-semibold text-ink text-sm truncate">
                {lang === "en" ? v.name : v.nameHi}
              </div>
              <div className="text-xs text-ink-muted truncate">
                {lang === "en" ? v.business : v.businessHi}
              </div>
              <div className="text-[10px] text-ink-muted mt-0.5 font-mono">
                {v.connections.length} {t("conns", lang)}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <ScoreBadge score={v.score} />
              <button
                onClick={onConnect}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-brand-deep text-gold-soft hover:opacity-90 transition-opacity"
              >
                {t("connect", lang)}
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-sm text-ink-muted py-12">— No vendors match —</div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SHARED
// ============================================================
function TrustGauge({ score, lang }: { score: number; lang: Lang }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    setDisplayed(0);
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(score * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const r = 72;
  const c = 2 * Math.PI * r;
  const offset = c - (displayed / 100) * c;
  const color = score >= 80 ? "var(--brand-deep)" : score >= 50 ? "var(--gold)" : "var(--danger)";

  return (
    <div className="relative w-48 h-48 my-2">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="var(--gold)" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r={r} stroke="var(--line)" strokeWidth="10" fill="none" />
        <circle
          cx="80" cy="80" r={r}
          stroke="url(#gaugeGrad)"
          strokeWidth="10" fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display font-bold text-5xl text-ink tabular-nums leading-none">{displayed}</div>
          <div className="text-[10px] text-ink-muted uppercase tracking-[0.16em] font-semibold mt-1.5">
            {t("trustScore", lang)}
          </div>
          <div className="text-[9px] text-ink-muted font-mono mt-0.5">{t("outOf", lang)}</div>
        </div>
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 80
      ? "bg-brand-soft text-brand-deep border-brand/30"
      : score >= 50
        ? "bg-gold-soft text-warn-deep border-gold/40"
        : "bg-danger-soft text-danger-deep border-danger/30";
  return (
    <span className={`px-2.5 py-1 rounded-lg text-sm font-display font-bold tabular-nums border ${cls}`}>
      {score}
    </span>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-md grid place-items-center px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-3xl p-6 max-w-sm w-full shadow-lift animate-scale-in border border-line"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function QrPattern() {
  const cells = useMemo(() => {
    const arr: boolean[] = [];
    let seed = 7;
    for (let i = 0; i < 169; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      arr.push(seed / 233280 > 0.5);
    }
    return arr;
  }, []);
  return (
    <div className="w-full h-full grid gap-[2px]" style={{ gridTemplateColumns: "repeat(13, 1fr)" }}>
      {cells.map((on, i) => {
        const row = Math.floor(i / 13);
        const col = i % 13;
        const isCorner = (row < 3 && col < 3) || (row < 3 && col > 9) || (row > 9 && col < 3);
        const filled = isCorner
          ? (row === 0 || row === 2 || col === 0 || col === 2 || (row === 1 && col === 1))
          : on;
        return (
          <div key={i} className={`aspect-square rounded-[1px] ${filled ? "bg-brand-deep" : "bg-transparent"}`} />
        );
      })}
    </div>
  );
}

// Icons
function Logo() {
  return (
    <div className="w-10 h-10 rounded-xl bg-brand-deep grid place-items-center shadow-soft ring-1 ring-gold/40 relative overflow-hidden">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-soft)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    </div>
  );
}
function CheckIcon({ size = 14 }: { size?: number } = {}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function WarnIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function ChipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="2" x2="9" y2="4" /><line x1="15" y1="2" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="22" /><line x1="15" y1="20" x2="15" y2="22" />
      <line x1="20" y1="9" x2="22" y2="9" /><line x1="20" y1="14" x2="22" y2="14" />
      <line x1="2" y1="9" x2="4" y2="9" /><line x1="2" y1="14" x2="4" y2="14" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
function QrIconSmall() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><line x1="14" y1="14" x2="14" y2="17" />
      <line x1="14" y1="20" x2="17" y2="20" /><line x1="17" y1="17" x2="21" y2="17" />
      <line x1="21" y1="20" x2="21" y2="21" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-ink-muted" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function PenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
