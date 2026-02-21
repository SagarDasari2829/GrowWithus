import { toYouTubeWatchUrl } from "../../utils/youtube";

export default function ModuleChecklist({ topics, completedTopicTitles, onToggleTopic }) {
  if (!topics.length) {
    return <p className="text-sm text-slate-500">No topics defined yet.</p>;
  }

  return (
    <div className="space-y-3">
      {topics.map((topic, index) => {
        const key = `${topic.title}-${index}`;
        const checked = completedTopicTitles.includes(topic.title);

        return (
          <label key={key} className="block rounded-lg border border-slate-200 bg-white p-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleTopic(topic.title)}
                className="mt-1 h-4 w-4"
              />
              <div className="space-y-1">
                <p className="font-medium text-slate-800">{topic.title}</p>
                {topic.practiceTask && <p className="text-xs text-slate-500">{topic.practiceTask}</p>}
                {topic.videos?.length > 0 && (
                  <ul className="list-disc space-y-1 pl-5 text-xs text-slate-500">
                    {topic.videos.map((video) => (
                      <li key={`${video.youtubeId}-${video.title}`}>
                        <a className="text-brand-700 hover:underline" href={toYouTubeWatchUrl(video.youtubeId)} target="_blank" rel="noreferrer">
                          {video.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}

