function createElement(className, styleText) {
  const element = document.createElement("div");
  element.className = className;
  element.style.cssText = styleText;
  return element;
}

function createNightStars(container) {
  for (let index = 0; index < 80; index += 1) {
    const size = Math.random() < 0.2 ? 3 : Math.random() < 0.5 ? 2 : 1;
    const opacity = 0.3 + Math.random() * 0.7;
    container.appendChild(
      createElement(
        "star-night",
        `
          width:${size}px;height:${size}px;
          top:${Math.random() * 55}%;left:${Math.random() * 100}%;
          --o:${opacity};--d:${2 + Math.random() * 4}s;--dl:${Math.random() * 4}s;
        `,
      ),
    );
  }
}

function createDayMotes(container) {
  for (let index = 0; index < 55; index += 1) {
    const size = Math.random() < 0.15 ? 5 : Math.random() < 0.45 ? 3 : 2;
    const opacity = 0.3 + Math.random() * 0.6;
    const fx = (Math.random() - 0.5) * 30;
    const fy = (Math.random() - 0.5) * 20;
    const fz = (Math.random() - 0.5) * 25;
    container.appendChild(
      createElement(
        "star",
        `
          width:${size}px;height:${size}px;
          top:${5 + Math.random() * 65}%;left:${Math.random() * 100}%;
          --o:${opacity};--d:${6 + Math.random() * 10}s;--dl:${Math.random() * 8}s;
          --fx:${fx}px;--fy:${fy}px;--fz:${fz}px;
        `,
      ),
    );
  }
}

function createClouds(container) {
  [
    { w: 180, h: 44, top: 8, delay: 0, dur: 55 },
    { w: 120, h: 28, top: 14, delay: 15, dur: 45 },
    { w: 240, h: 52, top: 5, delay: 28, dur: 65 },
    { w: 90, h: 22, top: 20, delay: 5, dur: 40 },
    { w: 160, h: 38, top: 12, delay: 38, dur: 52 },
  ].forEach((cloud) => {
    const opacity = 0.55 + Math.random() * 0.3;
    container.appendChild(
      createElement(
        "cloud",
        `
          width:${cloud.w}px;height:${cloud.h}px;
          top:${cloud.top}%;
          --cd:${cloud.dur}s;--cdl:${-cloud.delay}s;
          --co:${opacity};
        `,
      ),
    );
  });
}

function createNightFireflies(container) {
  for (let index = 0; index < 18; index += 1) {
    const fx = (Math.random() - 0.5) * 80;
    const fy = -(20 + Math.random() * 80);
    const fx2 = (Math.random() - 0.5) * 60;
    const fy2 = -(60 + Math.random() * 100);
    container.appendChild(
      createElement(
        "firefly-night",
        `
          left:${5 + Math.random() * 90}%;top:${40 + Math.random() * 55}%;
          --fd:${5 + Math.random() * 8}s;--fdl:${Math.random() * 6}s;
          --fx:${fx}px;--fy:${fy}px;--fx2:${fx2}px;--fy2:${fy2}px;
        `,
      ),
    );
  }
}

function createDaySparkles(container) {
  for (let index = 0; index < 22; index += 1) {
    const size = 3 + Math.random() * 4;
    container.appendChild(
      createElement(
        "firefly",
        `
          width:${size}px;height:${size}px;
          left:${5 + Math.random() * 90}%;top:${15 + Math.random() * 70}%;
          --fd:${3 + Math.random() * 6}s;--fdl:${Math.random() * 7}s;
        `,
      ),
    );
  }
}

export function initSceneEffects() {
  const starsContainer = document.getElementById("stars");
  const firefliesContainer = document.getElementById("fireflies");

  if (starsContainer) {
    createNightStars(starsContainer);
    createDayMotes(starsContainer);
    createClouds(starsContainer);
  }

  if (firefliesContainer) {
    createNightFireflies(firefliesContainer);
    createDaySparkles(firefliesContainer);
  }
}
