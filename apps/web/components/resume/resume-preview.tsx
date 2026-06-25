type Props = {
  content: any;
};

export function ResumePreview({
  content
}: Props) {


  const safeContent =
    typeof content === "string"
      ? content
      : JSON.stringify(content, null, 2);


  const sections = safeContent
    .split("\n")
    .filter(Boolean);

  return (

    <div
      className="
      space-y-4
      text-sm
      leading-7
      text-zinc-200
      "
    >

      {sections.map((line, index)=>{

        const trimmed = line.trim();

        const isHeading =
          trimmed === trimmed.toUpperCase() &&
          trimmed.length < 40;

        if (isHeading) {

          return (

            <div
              key={index}
              className="
              pt-3
              text-lg
              font-semibold
              tracking-wide
              text-cyan-300
              "
            >

              {trimmed}

            </div>

          );

        }

        const isBullet =
          trimmed.startsWith("-") ||
          trimmed.startsWith("•");

        if (isBullet) {

          return (

            <div
              key={index}
              className="
              flex
              gap-3
              pl-2
              "
            >

              <span className="text-cyan-400">

                •

              </span>

              <span>

                {trimmed
                  .replace(/^-/, "")
                  .replace(/^•/, "")
                  .trim()}

              </span>

            </div>

          );

        }

        return (

          <p
            key={index}
            className="text-zinc-300"
          >

            {trimmed}

          </p>

        );

      })}

    </div>

  );

}