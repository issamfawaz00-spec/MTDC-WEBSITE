import { channels } from "@/content/channels";
import { Icon } from "@/components/ui/Icon";

/** The eight trade channels MTDC supplies, as a hairline grid. */
export function ChannelGrid({ descriptions = true }: { descriptions?: boolean }) {
  return (
    <ul className="grid grid-cols-2 border-t border-l border-line lg:grid-cols-4">
      {channels.map((c) => (
        <li key={c.id} className="border-r border-b border-line p-5 sm:p-7" data-reveal>
          <Icon name={c.icon} className="size-6 text-teal-600" />
          <h3 className="mt-6 text-base font-semibold text-ink-900 sm:text-[1.05rem]">{c.label}</h3>
          {descriptions && <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{c.description}</p>}
        </li>
      ))}
    </ul>
  );
}
