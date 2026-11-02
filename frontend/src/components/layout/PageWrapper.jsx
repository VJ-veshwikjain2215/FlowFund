import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

const pages = [['dashboard','Overview'],['transactions','Ledger'],['health','Financial health'],['planner','Planner'],['vacation','Time off']];
export default function PageWrapper({children}) {
  return <div className="workspace"><header className="work-head"><Link className="mast" to="/dashboard">FlowFund</Link><ProfileDropdown /></header>
    <nav aria-label="Workspace" className="work-nav">{pages.map(([path,label])=><NavLink key={path} to={'/'+path}>{label}</NavLink>)}</nav>
    <main className="work-content">{children}</main></div>;
}
