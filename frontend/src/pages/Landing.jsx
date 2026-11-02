import React from 'react';
import { Link } from 'react-router-dom';

const entries = [
  ['04 Apr', 'Brand identity', '₹48,000', 'income'],
  ['08 Apr', 'Studio rent', '−₹12,000', 'expense'],
  ['16 Apr', 'Editorial commission', '₹26,500', 'income'],
  ['22 Apr', 'Software & supplies', '−₹4,800', 'expense']
];

export default function Landing() {
  return <main className="paper cover">
    <header><Link className="mast" to="/">FlowFund</Link><Link className="under" to="/auth">Sign in ↗</Link></header>
    <div className="cover-grid"><section className="intro"><small>THE FREELANCER’S LEDGER</small>
      <h1>Uneven income.<br/><em>Clear accounts.</em></h1>
      <p>Bring your transactions together and see what a quiet month could mean for your spending.</p>
      <Link className="ink-button" to="/auth?mode=signup">Start your ledger <span>→</span></Link>
    </section><figure className="statement"><small>EXAMPLE STATEMENT <b>№ 04</b></small><h2>April ledger</h2>
    <div className="entry headings"><span>Date</span><span>Description</span><span>Amount</span></div>
    {entries.map(([date, label, amount, type]) => <div className="entry" key={date}><time>{date}</time><span>{label}</span><strong className={type}>{amount}</strong></div>)}
    <figcaption>Net for the month <b>₹57,700</b></figcaption></figure></div>
    <footer>{[['01','Import a CSV','Bring in your income and expenses.'],['02','Read your month','See what came in and where it went.'],['03','Plan a break','Explore how long your savings could last.']].map(([n,t,d])=><div key={n}><small>{n}</small><h3>{t}</h3><p>{d}</p></div>)}</footer>
  </main>;
}
