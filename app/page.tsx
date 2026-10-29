"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type View = "overview" | "transaction" | "fbr";
type RecordType = "Bike sale" | "Service";

type Transaction = {
  id: string;
  fbrId: string;
  customer: string;
  email: string;
  product: string;
  type: RecordType;
  amount: number;
  date: string;
  status: "Submitted" | "Pending";
};

const initialTransactions: Transaction[] = [
  { id: "TXN-2048", fbrId: "FBR-882104", customer: "Ayesha Khan", email: "ayesha.khan@email.com", product: "Honda CD 70", type: "Bike sale", amount: 157900, date: "Oct 29, 2026", status: "Submitted" },
  { id: "TXN-2047", fbrId: "FBR-882103", customer: "Hamza Ali", email: "hamza.ali@email.com", product: "Honda CG 125", type: "Bike sale", amount: 234900, date: "Oct 28, 2026", status: "Submitted" },
  { id: "TXN-2046", fbrId: "FBR-882102", customer: "Sara Ahmed", email: "sara.ahmed@email.com", product: "Workshop service", type: "Service", amount: 12500, date: "Oct 27, 2026", status: "Submitted" },
  { id: "TXN-2045", fbrId: "FBR-882101", customer: "Bilal Raza", email: "bilal.raza@email.com", product: "Honda CB 150F", type: "Bike sale", amount: 493900, date: "Oct 26, 2026", status: "Pending" },
  { id: "TXN-2044", fbrId: "FBR-882100", customer: "Maha Noor", email: "maha.noor@email.com", product: "Parts & accessories", type: "Service", amount: 8600, date: "Oct 25, 2026", status: "Submitted" },
];

const bikes = [
  { name: "Honda CD 70", price: 157900 },
  { name: "Honda CG 125", price: 234900 },
  { name: "Honda CB 150F", price: 493900 },
  { name: "Honda Pridor", price: 208900 },
  { name: "Honda CG 125S Gold", price: 282900 },
  { name: "Workshop service", price: 12500 },
  { name: "Parts & accessories", price: 8600 },
];

const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const salesSeries = [39, 54, 46, 68, 61, 82];
const revenueSeries = [45, 59, 52, 73, 66, 88];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    receipt: <><path d="M5 3.5h14v17l-3.5-2-3.5 2-3.5-2-3.5 2z" /><path d="M8.5 9h7M8.5 13h7" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    bike: <><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M8 17.5 11 10h4l3.5 7.5M9.5 13h6M10 9H8" /></>,
    money: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M7 9h.01M17 15h.01" /></>,
    wrench: <><path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4L14 12l-2-2z" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5" /><path d="M5 17v4h14v-4" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
    eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    filter: <><path d="M4 6h16M7 12h10m-7 6h4" /></>,
  };
  return <svg {...common} aria-hidden="true">{paths[name] ?? paths.grid}</svg>;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);
}

function SalesChart({ sales, revenue }: { sales: number[]; revenue: number[] }) {
  const toPoints = (data: number[]) => data.map((value, index) => `${48 + index * 91},${173 - value * 1.42}`).join(" ");
  const salesPoints = toPoints(sales);
  const revenuePoints = toPoints(revenue);
  const areaPath = `M ${salesPoints.replaceAll(" ", " L ")} L 503,184 L 48,184 Z`;
  return (
    <svg className="sales-chart" viewBox="0 0 550 210" role="img" aria-label="Monthly sales trend chart">
      <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#d71920" stopOpacity=".16" /><stop offset="100%" stopColor="#d71920" stopOpacity="0" /></linearGradient></defs>
      {[28, 68, 108, 148, 188].map((y) => <line key={y} x1="40" x2="510" y1={y} y2={y} stroke="#ecebe9" strokeDasharray="3 5" />)}
      <path d={areaPath} fill="url(#chartFill)" />
      <polyline points={revenuePoints} fill="none" stroke="#d6ad47" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 4" />
      <polyline points={salesPoints} fill="none" stroke="#d71920" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {sales.map((value, index) => <circle key={index} cx={48 + index * 91} cy={173 - value * 1.42} r={index === sales.length - 1 ? 5 : 3.5} fill="#fff" stroke="#d71920" strokeWidth="2.5" />)}
      {[0, 1, 2, 3, 4].map((i) => <text key={i} x="2" y={32 + i * 40} className="chart-label">{["100", "75", "50", "25", "0"][i]}</text>)}
      {months.map((month, i) => <text key={month} x={48 + i * 91} y="207" textAnchor="middle" className="chart-label">{month}</text>)}
    </svg>
  );
}

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState<View>("overview");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [period, setPeriod] = useState("Last 6 months");
  const [search, setSearch] = useState("");
  const [loginError, setLoginError] = useState("");
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const savedAuth = window.localStorage.getItem("honda-admin-auth");
    const savedTransactions = window.localStorage.getItem("honda-transactions");
    if (savedAuth === "true") setAuthenticated(true);
    if (savedTransactions) {
      try {
        const parsed: unknown = JSON.parse(savedTransactions);
        if (Array.isArray(parsed)) setTransactions(parsed as Transaction[]);
      } catch {
        window.localStorage.removeItem("honda-transactions");
      }
    }
  }, []);

  const totals = useMemo(() => ({
    bikes: transactions.filter((item) => item.type === "Bike sale").length + 124,
    revenue: transactions.reduce((sum, item) => sum + item.amount, 0) + 28645000,
    services: transactions.filter((item) => item.type === "Service").reduce((sum, item) => sum + item.amount, 0) + 486000,
  }), [transactions]);

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("email") === "admin@gmail.com" && data.get("password") === "admin") {
      window.localStorage.setItem("honda-admin-auth", "true");
      setAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Email or password is incorrect. Please try again.");
    }
  }

  function addTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const customer = String(data.get("customer") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const product = String(data.get("product") ?? "");
    const amount = Number(data.get("amount"));
    if (!customer || !email || !product || !Number.isFinite(amount) || amount <= 0) {
      setFormError("Please complete all fields with a valid amount.");
      return;
    }
    const type: RecordType = product.includes("service") || product.includes("accessories") ? "Service" : "Bike sale";
    const idNumber = 2049 + transactions.length - initialTransactions.length;
    const fbrNumber = 882105 + transactions.length - initialTransactions.length;
    const entry: Transaction = {
      id: `TXN-${idNumber}`,
      fbrId: `FBR-${fbrNumber}`,
      customer,
      email,
      product,
      type,
      amount,
      date: new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(new Date()),
      status: "Submitted",
    };
    const updated = [entry, ...transactions];
    setTransactions(updated);
    window.localStorage.setItem("honda-transactions", JSON.stringify(updated));
    setFormError("");
    event.currentTarget.reset();
    setAmount("");
    setView("fbr");
  }

  const filteredTransactions = transactions.filter((item) =>
    [item.id, item.fbrId, item.customer, item.email, item.product].some((value) => value.toLowerCase().includes(search.toLowerCase())),
  );

  if (!authenticated) {
    return (
      <main className="login-page">
        <section className="login-art">
          <div className="login-brand"><span className="brand-mark">H</span><span>HONDA <small>DEALER PORTAL</small></span></div>
          <div className="login-copy">
            <p className="eyebrow light">YOUR DEALERSHIP, IN SYNC</p>
            <h1>Built for the<br />road ahead.</h1>
            <p>One clear view of your sales, service, and business performance.</p>
          </div>
          <div className="login-art-footer"><span>HONDA MOTORCYCLES</span><span>EST. 1948</span></div>
          <div className="art-ring ring-one" /><div className="art-ring ring-two" />
        </section>
        <section className="login-panel">
          <div className="login-form-wrap">
            <div className="mobile-brand"><span className="brand-mark">H</span><span>HONDA <small>DEALER PORTAL</small></span></div>
            <p className="eyebrow">WELCOME BACK</p>
            <h2>Sign in to your account</h2>
            <p className="login-subtitle">Enter your details to access the dealer dashboard.</p>
            <form onSubmit={signIn} className="login-form">
              <label htmlFor="login-email">Email address</label>
              <input id="login-email" name="email" type="email" placeholder="you@dealership.com" autoComplete="username" required />
              <div className="label-row"><label htmlFor="login-password">Password</label><span> </span></div>
              <div className="password-field">
                <input id="login-password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" required />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}><Icon name="eye" size={18} /></button>
              </div>
              {loginError && <p className="error-message">{loginError}</p>}
              <button type="submit" className="primary-button login-button">Sign in <Icon name="chevron" size={17} /></button>
            </form>
            <div className="login-hint"><span className="hint-dot" /> Demo access <strong>admin@gmail.com</strong><span className="hint-separator">·</span><strong>admin</strong></div>
          </div>
          <div className="login-copyright">© 2026 Honda Dealer Portal <span>·</span> Made for the people who move us</div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand"><span className="brand-mark">H</span><span>HONDA <small>DEALER PORTAL</small></span></div>
        <div className="dealer-card"><div className="dealer-avatar">HC</div><div><strong>Honda Central</strong><span>Authorized dealer</span></div><span className="dealer-status" /></div>
        <p className="nav-heading">WORKSPACE</p>
        <nav className="side-nav" aria-label="Main navigation">
          <button className={view === "overview" ? "nav-item active" : "nav-item"} onClick={() => setView("overview")}><Icon name="grid" /><span>Overview</span>{view === "overview" && <span className="nav-active-mark" />}</button>
          <button className={view === "transaction" ? "nav-item active" : "nav-item"} onClick={() => setView("transaction")}><Icon name="plus" /><span>New transaction</span>{view === "transaction" && <span className="nav-active-mark" />}</button>
          <button className={view === "fbr" ? "nav-item active" : "nav-item"} onClick={() => setView("fbr")}><Icon name="receipt" /><span>FBR entries</span>{view === "fbr" && <span className="nav-active-mark" />}</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="support-card"><div className="support-icon"><Icon name="wrench" size={17} /></div><strong>Need a hand?</strong><span>Our dealer support team is here for you.</span><button onClick={() => window.alert("Please contact your Honda dealer support representative.")}>Contact support <Icon name="chevron" size={14} /></button></div>
          <button className="profile-card" onClick={() => { window.localStorage.removeItem("honda-admin-auth"); setAuthenticated(false); }}>
            <span className="profile-avatar">AD</span><span className="profile-copy"><strong>Admin account</strong><small>admin@gmail.com</small></span><Icon name="logout" size={17} />
          </button>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Honda Central</span><Icon name="chevron" size={15} /><strong>{view === "overview" ? "Overview" : view === "transaction" ? "New transaction" : "FBR entries"}</strong></div>
          <div className="topbar-actions"><div className="today-pill"><span /> System operational</div><button className="icon-button notification-button" aria-label="Notifications"><Icon name="bell" size={19} /><i /></button><div className="topbar-avatar">AD</div></div>
        </header>

        <div className="content">
          {view === "overview" && <>
            <div className="page-heading">
              <div><p className="eyebrow">THURSDAY, OCTOBER 29, 2026</p><h1>Good morning, Admin <span className="wave">✳</span></h1><p className="page-subtitle">Here&apos;s what&apos;s happening at your dealership today.</p></div>
              <button className="primary-button" onClick={() => setView("transaction")}><Icon name="plus" size={18} /> New transaction</button>
            </div>
            <section className="metric-grid" aria-label="Business metrics">
              <MetricCard title="Total bike sales" value={String(totals.bikes)} change="+12.8%" note="vs. last month" icon="bike" accent="red" />
              <MetricCard title="Total revenue" value={formatCurrency(totals.revenue)} change="+8.4%" note="vs. last month" icon="money" accent="gold" />
              <MetricCard title="Service income" value={formatCurrency(totals.services)} change="+6.2%" note="vs. last month" icon="wrench" accent="green" />
              <MetricCard title="FBR submissions" value={String(transactions.filter((item) => item.status === "Submitted").length + 119)} change="98.5%" note="submission rate" icon="receipt" accent="blue" />
            </section>

            <section className="dashboard-grid">
              <div className="card chart-card">
                <div className="card-heading"><div><h2>Sales performance</h2><p>Track sales and revenue over time</p></div><select aria-label="Chart time period" value={period} onChange={(event) => setPeriod(event.target.value)}><option>Last 6 months</option><option>Last 12 months</option><option>This year</option></select></div>
                <div className="chart-legend"><span><i className="legend-dot sales-dot" /> Bike sales</span><span><i className="legend-dot revenue-dot" /> Revenue</span></div>
                <SalesChart sales={salesSeries} revenue={revenueSeries} />
                <div className="chart-summary"><span>Monthly sales volume</span><strong>82 bikes <small>↑ 12.8%</small></strong></div>
              </div>
              <div className="card product-card">
                <div className="card-heading"><div><h2>Top models</h2><p>Best-selling this month</p></div><button className="text-button" onClick={() => setView("fbr")}>View all <Icon name="chevron" size={14} /></button></div>
                <div className="model-list">
                  <ModelRow number="01" name="Honda CD 70" sales="32 sold" share="78%" color="red" />
                  <ModelRow number="02" name="Honda CG 125" sales="24 sold" share="62%" color="gold" />
                  <ModelRow number="03" name="Honda CB 150F" sales="14 sold" share="44%" color="blue" />
                  <ModelRow number="04" name="Honda Pridor" sales="12 sold" share="33%" color="green" />
                </div>
                <div className="product-card-footer"><span>October 2026</span><strong>82 total units</strong></div>
              </div>
            </section>

            <section className="card transactions-card">
              <div className="card-heading transactions-heading"><div><h2>Recent transactions</h2><p>Your latest sales and service activity</p></div><button className="text-button" onClick={() => setView("fbr")}>All transactions <Icon name="chevron" size={14} /></button></div>
              <TransactionTable items={transactions.slice(0, 4)} />
            </section>
          </>}

          {view === "transaction" && <div className="form-page">
            <div className="page-heading"><div><p className="eyebrow">SALES &amp; SERVICE</p><h1>Create transaction</h1><p className="page-subtitle">Record a bike sale or service and prepare its FBR entry.</p></div><button className="secondary-button" onClick={() => setView("overview")}>Cancel</button></div>
            <form className="card transaction-form" onSubmit={addTransaction}>
              <div className="form-section-title"><span className="step-number">01</span><div><h2>Transaction details</h2><p>Choose a product and confirm the amount.</p></div></div>
              <div className="form-grid">
                <div className="field-group"><label htmlFor="product">Product or service <span>*</span></label><select id="product" name="product" required defaultValue="" onChange={(event) => { const selected = bikes.find((bike) => bike.name === event.target.value); if (selected) setAmount(String(selected.price)); }}><option value="" disabled>Select a Honda model or service</option>{bikes.map((bike) => <option key={bike.name} value={bike.name}>{bike.name}</option>)}</select></div>
                <div className="field-group"><label htmlFor="amount">Transaction amount (PKR) <span>*</span></label><input id="amount" name="amount" type="number" min="1" placeholder="e.g. 157900" value={amount} onChange={(event) => setAmount(event.target.value)} required /></div>
                <div className="field-group"><label htmlFor="customer">Customer name <span>*</span></label><input id="customer" name="customer" placeholder="Enter customer&apos;s full name" required /></div>
                <div className="field-group"><label htmlFor="customer-email">Customer email <span>*</span></label><input id="customer-email" name="email" type="email" placeholder="customer@email.com" required /></div>
              </div>
              <div className="fbr-notice"><span className="notice-icon"><Icon name="receipt" size={19} /></span><div><strong>FBR entry created automatically</strong><p>A transaction reference and FBR entry will be created when you save.</p></div><span className="notice-check">✓</span></div>
              {formError && <p className="error-message">{formError}</p>}
              <div className="form-actions"><span><i /> All fields marked <b>*</b> are required</span><button type="submit" className="primary-button"><Icon name="plus" size={17} /> Save transaction</button></div>
            </form>
          </div>}

          {view === "fbr" && <>
            <div className="page-heading"><div><p className="eyebrow">TAX &amp; COMPLIANCE</p><h1>FBR entries</h1><p className="page-subtitle">A record of all your sales and service transactions.</p></div><button className="primary-button" onClick={() => setView("transaction")}><Icon name="plus" size={18} /> New transaction</button></div>
            <section className="fbr-stats">
              <div className="card fbr-stat"><span className="stat-icon green"><Icon name="receipt" /></span><div><span>Submitted entries</span><strong>{transactions.filter((item) => item.status === "Submitted").length + 119}</strong></div><small>↑ 8.2%</small></div>
              <div className="card fbr-stat"><span className="stat-icon gold"><Icon name="clock" /></span><div><span>Pending review</span><strong>{transactions.filter((item) => item.status === "Pending").length + 2}</strong></div><small className="muted">Needs attention</small></div>
              <div className="card fbr-stat"><span className="stat-icon blue"><Icon name="money" /></span><div><span>Total reported</span><strong>{formatCurrency(totals.revenue)}</strong></div><small className="muted">This year</small></div>
            </section>
            <section className="card transactions-card fbr-table-card">
              <div className="table-toolbar"><div><h2>All entries <span className="count-badge">{transactions.length}</span></h2><p>FBR records generated from transactions</p></div><div className="table-actions"><label className="search-field"><Icon name="search" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search entries..." aria-label="Search FBR entries" /></label><button className="filter-button" onClick={() => setSearch("")}><Icon name="filter" size={17} /> Clear</button><button className="filter-button" onClick={() => window.alert("Your FBR entries are ready to export.")}><Icon name="download" size={17} /> Export</button></div></div>
              <TransactionTable items={filteredTransactions} showFbr />
            </section>
          </>}
          <footer className="page-footer"><span>© 2026 Honda Central Dealer Portal</span><span>Built for a better ride <b>♥</b></span></footer>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ title, value, change, note, icon, accent }: { title: string; value: string; change: string; note: string; icon: string; accent: string }) {
  return <div className="card metric-card"><div className="metric-top"><span>{title}</span><span className={`metric-icon ${accent}`}><Icon name={icon} size={19} /></span></div><strong className="metric-value">{value}</strong><div className="metric-foot"><span className="change-pill"><Icon name="arrow" size={12} /> {change}</span><span>{note}</span></div></div>;
}

function ModelRow({ number, name, sales, share, color }: { number: string; name: string; sales: string; share: string; color: string }) {
  return <div className="model-row"><span className="model-number">{number}</span><div className="model-info"><div className="model-meta"><strong>{name}</strong><span>{sales}</span></div><div className="progress-track"><div className={`progress-fill ${color}`} style={{ width: share }} /></div></div></div>;
}

function TransactionTable({ items, showFbr = false }: { items: Transaction[]; showFbr?: boolean }) {
  return <div className="table-scroll"><table><thead><tr><th>TRANSACTION</th>{showFbr && <th>FBR REFERENCE</th>}<th>CUSTOMER</th><th>PRODUCT</th><th>DATE</th><th>AMOUNT</th><th>STATUS</th></tr></thead><tbody>{items.length ? items.map((item) => <tr key={item.id}><td><strong className="transaction-id">{item.id}</strong></td>{showFbr && <td><span className="fbr-id">{item.fbrId}</span></td>}<td><span className="customer-name">{item.customer}</span><small className="customer-email">{item.email}</small></td><td><span className="product-name">{item.product}</span><small className="product-type">{item.type}</small></td><td className="date-cell">{item.date}</td><td className="amount-cell">{formatCurrency(item.amount)}</td><td><span className={`status-badge ${item.status.toLowerCase()}`}><i />{item.status}</span></td></tr>) : <tr><td className="empty-row" colSpan={showFbr ? 7 : 6}>No entries match your search.</td></tr>}</tbody></table></div>;
}
