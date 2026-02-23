import React, { lazy, Suspense } from "react";
import "./App.css";
import Layout from "./components/layout/Layout1";
import Hero from "./components/sections/Hero";

// Lazy load sections for better performance
const About = lazy(() => import("./components/sections/About"));
const Projects = lazy(() => import("./components/sections/Projects"));
const Experience = lazy(() => import("./components/sections/Experience"));
const Contact = lazy(() => import("./components/sections/Contact"));

function App() {
  return (
    <Layout>
      <Hero />
      <Suspense fallback={<div style={{ minHeight: "400px" }} />}>
        <About />
      </Suspense>
      <Suspense fallback={<div style={{ minHeight: "400px" }} />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<div style={{ minHeight: "400px" }} />}>
        <Experience />
      </Suspense>
      <Suspense fallback={<div style={{ minHeight: "400px" }} />}>
        <Contact />
      </Suspense>
    </Layout>
  );
}

export default App;
