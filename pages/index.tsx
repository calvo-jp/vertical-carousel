import { useEffect, useRef, useState } from "react";

export default function Landing() {
  const [index, setIndex] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const menulistRef = useRef<HTMLUListElement>(null);

  /* handle height of content */
  useEffect(() => {
    const menulist = menulistRef.current;
    const content = contentRef.current;

    const updateContentHeight = () => {
      if (menulist && content) {
        content.style.height = menulist.offsetHeight + "px";
      }
    };

    updateContentHeight();
    window.addEventListener("resize", updateContentHeight);

    return () => {
      window.removeEventListener("resize", updateContentHeight);
    };
  }, []);

  /* handle scrolling */
  useEffect(() => {
    const content = contentRef.current;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (!content) return;

      const top =
        e.deltaY > 1
          ? content.scrollTop + content.offsetHeight
          : content.scrollTop - content.offsetHeight;

      content.scrollTo({ top });
    };

    content?.addEventListener("wheel", handleWheel);

    return () => {
      content?.removeEventListener("wheel", handleWheel);
    };
  }, []);

  /* update state based on what content is visible */
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

      <nav>
        <ul ref={menulistRef} className="flex flex-col gap-2">
          {items.map((item, ...args) => (
            <li key={item.label}>
              <button
                className="border data-[selected]:border-purple-300 transition-all duration-300 border-neutral-300 px-5 py-2 rounded-md"
                onClick={() => {
                  if (!contentRef.current) return;
                  const top = contentRef.current.offsetHeight * args[0];
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
