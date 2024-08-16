import React from "react";

export default function FooterAdmin() {
    return (<footer className="py-5" style={{backgroundColor: '#fcfbfb', borderTop: '2px solid #f5f5f5', marginTop: 250}}>
            <div className="container">
                <section className="footer-content text-center pb-0">
                    <div>
                        <span className="navbar-text text-black py-0">Copyright © </span>
                        <span className="navbar-text py-0 pl-1 text-black">2024</span>
                        <a href="#" target="_blank" className="text-black pl-1">Visa Appointment Engine</a>
                    </div>
                </section>
            </div>
    </footer>);
}