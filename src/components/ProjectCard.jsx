import { motion } from "framer-motion";
import { C, staggerItem } from "../theme";
import { AsciiBox } from "./AsciiBox";

export function ProjectCard({ project, group, studentId }) {
  const hasGrade    = group.grade != null;
  const hasComments = group.comments != null;

  return (
    <motion.div variants={staggerItem}>
      <AsciiBox className="mb-3" accent={C.yellow}>
        <div className="p-3 sm:p-5">

          {/* Title + coeff */}
          <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
            <span className="text-tm-white text-[15px] font-bold">{project.title}</span>
            <span className="text-tm-dim text-[11px]">{project.coeff}%</span>
          </div>

          {/* Group badge + status */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="text-[11px] px-2 py-0.5 tracking-wider font-bold border"
              style={{ color: C.yellow, borderColor: C.yellow }}
            >
              {group.groupName}
            </span>
            <span className="text-[11px] tracking-wider" style={{ color: C.green }}>
              ✓ REGISTERED
            </span>
            {hasGrade && (
              <span className="text-[11px] tracking-wider" style={{ color: C.cyan }}>
                ● GRADED
              </span>
            )}
          </div>

          {/* Dates + repo */}
          <div className="mb-4">
            <div className="text-tm-dim text-[11px] mb-1">
              start {project.startDate} ── deadline {project.deadline}
            </div>
            {group.repositoryLink && (
              <a
                href={group.repositoryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] tracking-wider break-all"
                style={{ color: C.cyan }}
              >
                ⬡ {group.repositoryLink}
              </a>
            )}
          </div>

          {/* Members */}
          <div className="mb-4">
            <div className="text-tm-dim text-[10px] tracking-widest mb-1.5">MEMBERS</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(group.members).map(([id, name]) => (
                <span
                  key={id}
                  className="text-[11px] px-2 py-0.5 border"
                  style={
                    id === studentId
                      ? { color: C.cyan, borderColor: C.cyan }
                      : { color: C.textDim, borderColor: C.border }
                  }
                >
                  {name} <span style={{ opacity: 0.5 }}>{id}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Grade + comments */}
          <div className="border-t pt-3" style={{ borderColor: C.border }}>
            {hasGrade ? (
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[22px] font-bold" style={{ color: C.green }}>
                  {group.grade}
                </span>
                <span className="text-tm-dim text-[14px]"> / {project.totalPoints}</span>
              </div>
            ) : (
              <div className="text-tm-dim text-[12px] tracking-wider mb-2">
                GRADE PENDING
              </div>
            )}
            {hasComments && (
              <div
                className="text-[12px] italic pl-3 border-l-2"
                style={{ color: C.text, borderColor: C.yellow }}
              >
                {group.comments}
              </div>
            )}
          </div>

        </div>
      </AsciiBox>
    </motion.div>
  );
}
