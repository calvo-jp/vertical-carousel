import { useEffect, useRef, useState } from "react";

export default function Landing() {
  const [index, setIndex] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const menulistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menulistRef.current && contentRef.current) {
      contentRef.current.style.height = menulistRef.current.offsetHeight + "px";
    }
  }, []);

  useEffect(() => {
    const content = contentRef.current;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (!content) return;

      const top =
        e.deltaY > 1
          ? content.scrollTop + content.clientHeight
          : content.scrollTop - content.clientHeight;

      content.scrollTo({ top });
    };

    content?.addEventListener("wheel", handleWheel);

    return () => {
      content?.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const value = entry.target.getAttribute("data-itemindex");

            if (value && /[0-9]+/.test(value)) {
              const newIndex = parseInt(value);

              if (!Number.isNaN(newIndex)) {
                setIndex(parseInt(value));
              }
            }
          }
        });
      },
      {
        threshold: 0.6,
      },
    );

    contentRef.current?.querySelectorAll("div[data-item]").forEach((element) => {
      observer.observe(element);
    });
  }, []);

  return (
    <div className="flex gap-3">
      <div
        ref={contentRef}
        className="h-0 rounded-md w-[450px] border border-neutral-300 overflow-y-hidden snap-y snap-mandatory scroll-smooth will-change-scroll flex-row"
      >
        {items.map((item, index) => (
          <div
            key={item.label}
            className="p-4 snap-start h-full snap-always leading-none"
            data-item=""
            data-itemindex={index.toString()}
          >
            {item.content}
          </div>
        ))}
      </div>

      <nav ref={menulistRef}>
        <ul className="flex flex-col gap-2">
          {items.map((item, ...args) => (
            <li key={item.label}>
              <button
                className="border data-[selected]:border-purple-300 transition-all duration-300 border-neutral-300 px-5 py-2 rounded-md"
                onClick={() => {
                  if (!contentRef.current) return;
                  const top = contentRef.current.clientHeight * args[0];
                  contentRef.current.scrollTo({ top });
                  setIndex(args[0]);
                }}
                {...(index === args[0] && {
                  "data-selected": "",
                })}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

const items = new Array(8).fill(null).map((_, index) => {
  const number = index + 1;

  return { label: `Item ${number}`, content: `Content ${number}` };
});
