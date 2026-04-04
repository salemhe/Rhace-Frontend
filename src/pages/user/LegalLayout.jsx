import Footer from "@/components/Footer";
import Header from "@/components/user/Header";
import { useEffect, useState } from "react";

const TEAL = "#0A6C6D";

/**
 * Shared layout for legal pages (Terms, Privacy, Cookies).
 * Props:
 *  - tag: string (e.g. "Legal")
 *  - title: string
 *  - effective: string
 *  - sections: Array<{ heading: string, content: string | string[] }>
 *  - toc: Array<string>  (table of contents labels)
 */
export default function LegalLayout({ tag, title, effective, sections, toc }) {
    const [activeSection, setActiveSection] = useState(0);
    const handleTocClick = (e, id) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const sections = document.querySelectorAll("[id^='section-']");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.id.replace("section-", ""));
                        setActiveSection(index);
                    }
                });
            },
            {
                rootMargin: "-30% 0px -60% 0px",
                threshold: 0.1,
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');`}</style>
            <Header />

            <main className="w-full mt-24 max-w-6xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="mb-14 border-b border-gray-100 pb-10">
                    <p className="text-[11px] tracking-[0.22em] uppercase mb-3 font-medium" style={{ color: TEAL }}>{tag}</p>
                    <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">{title}</h1>
                    <p className="text-gray-400 text-sm font-light">Effective Date: {effective}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
                    {/* Sticky TOC */}
                    {toc && toc.length > 0 && (
                        <aside className="hidden lg:block lg:col-span-1 sticky top-28">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">Contents</p>
                            <nav className="flex flex-col gap-2">
                                {toc.map((item, i) => (
                                    <a
                                        key={i}
                                        href={`#section-${i}`}
                                        onClick={(e) => handleTocClick(e, `section-${i}`)}
                                        className={`text-sm transition-colors leading-snug py-0.5 ${activeSection === i ? "font-medium" : "text-gray-400"
                                            }`}
                                        style={{
                                            color: activeSection === i ? TEAL : "#9ca3af",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
                                    >
                                        {i + 1}. {item}
                                    </a>
                                ))}
                            </nav>
                        </aside>
                    )}

                    {/* Content */}
                    <div className={`${toc && toc.length > 0 ? "lg:col-span-3" : "lg:col-span-4"} flex flex-col gap-10`}>
                        {sections.map((section, i) => (
                            <div key={i} id={`section-${i}`} className="scroll-mt-32">
                                <h2 className="text-base font-semibold text-gray-900 mb-4 tracking-tight">
                                    {i + 1}. {section.heading}
                                </h2>
                                {Array.isArray(section.content) ? (
                                    <div className="flex flex-col gap-2">
                                        {section.content.map((item, j) => (
                                            <div key={j} className="flex items-start gap-3">
                                                <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: TEAL }} />
                                                <p className="text-gray-500 text-sm leading-relaxed font-light">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm leading-relaxed font-light">{section.content}</p>
                                )}
                                {i < sections.length - 1 && <div className="border-b border-gray-100 mt-10" />}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}