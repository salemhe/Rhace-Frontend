"use client";

import { Dot } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function TapCreditSteps({
  steps,
  backgroundColor = "linear-gradient(180.63deg,#032723 -8.96%,#07160B 28.31%, #021A18 62.55%)",
  backgroundImage = "../../../../../../public/enterprise/tapcredit/green-card.png",
  accentColor = "#3C9C91",
  title,
  subTitle,
  buttons,
}) {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.25));
    }, 75);

    return () => clearInterval(interval);
  }, [isPaused]);

  const stepCount = steps.length;
  const currentStep = Math.floor((progress / 100) * stepCount);
  const progressInStep = ((progress / 100) * stepCount - currentStep) * 100;

  const backgroundStyle = backgroundImage
    ? {
        backgroundColor: "transparent",
        backgroundImage: `${backgroundColor}, url('${backgroundImage}')`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }
    : {
        background: backgroundColor,
      };

  return (
    <div
      data-group="dark-mode"
      className="max-md:py-[4rem] md:py-[6rem] md:pb-[10rem] flex-col flex items-center justify-center px-5  m-[2rem] rounded-[4rem]"
      style={backgroundStyle}
    >
      {buttons ? (
        <div className="flex section-layout pb-[1rem]">
          {buttons.map((btn, idx) => (
            <Button
              variant={btn?.isActive ? "default" : "ghost"}
              key={`btn-${idx}`}
              onClick={btn?.onClick}
              className={`relative ${btn.isActive ? "font-bold" : ""}`}
            >
              {btn.btnText}

              {btn.isActive && (
                <Dot
                  className="absolute left-1/2 -translate-x-1/2 -bottom-[2.5rem]"
                  color={btn?.activeDotColor || "#917BE8"}
                  size={30}
                />
              )}
            </Button>
          ))}
        </div>
      ) : (
        <></>
      )}

      <div className="section-layout text-start w-full">
        <p
          style={{ color: accentColor }}
          className="text-[#3C9C91] text-[1.2rem] sm:text-[1.4rem] md:text-[1.6rem] font-semibold tracking-wider mb-4 mt-12"
        >
          {title || "HOW TAP CREDIT WORKS FOR ORGANIZATION"}
        </p>
        <p className="text-white text-[2.4rem] sm:text-5xl md:text-6xl font-semibold tracking-tight">
          {subTitle || `Credit in ${stepCount} easy steps`}
        </p>
      </div>

      <div
        className="w-full mt-16 flex flex-col items-start overflow-x-scroll hide-scrollbar relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="section-layout overflow-x-auto hide-scrollbar">
          <div className="flex flex-col md:flex-row">
            {steps.map((obj, i) => {
              const isActive = i === currentStep;
              const fillPercentage =
                i < currentStep ? 100 : isActive ? progressInStep : 0;

              return (
                <div
                  key={i}
                  className="flex md:flex-col max-md:pb-[5rem] gap-12 w-full md:w-[370px] shrink-0 card-item"
                >
                  <div className="flex md:items-center relative">
                    <div
                      style={{ borderColor: accentColor }}
                      className="size-20 sm:size-24 md:size-28 rounded-full border border-[#3C9C91] text-white flex items-center justify-center text-3xl font-semibold relative overflow-hidden shrink-0 max-md:rotate-180"
                    >
                      <div
                        className="absolute bottom-0 inset-x-0 bg-[#3C9C91] transition-[height] duration-500 ease-linear "
                        style={{
                          height: `${fillPercentage}%`,
                          backgroundColor: accentColor,
                        }}
                      />
                      <span className="relative z-10 max-md:rotate-180">
                        {i + 1}
                      </span>
                    </div>

                    {i !== steps.length - 1 && (
                      <div className="h-[1px] w-full flex-1 bg-[#333333] relative overflow-hidden ">
                        <div
                          className="absolute top-0 left-0 h-full bg-[#3C9C91] transition-all duration-500 ease-linear"
                          style={{
                            height:
                              i < currentStep
                                ? "100%"
                                : i === currentStep
                                  ? `${progressInStep}%`
                                  : "0%",
                            backgroundColor: accentColor,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Step content */}
                  <div className="text-white w-full font-semibold flex flex-col tracking-tight">
                    <p className="text-[1.8rem] sm:text-[2rem] md:text-[2.4rem]">
                      {obj.title}
                    </p>
                    <p className="tracking-normal md:w-[328px]  text-[1.4rem] sm:text-[1.7rem] md:text-[2rem] text-wrap mt-6 text-[#9D9D9D] font-normal">
                      {obj.description}{" "}
                      {obj.linkText && (
                        <a
                          style={{ color: accentColor }}
                          className="underline font-bold italic text-[#3C9C91] cursor-pointer"
                          href={obj.linkUrl || "#"}
                        >
                          {obj.linkText}
                        </a>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
