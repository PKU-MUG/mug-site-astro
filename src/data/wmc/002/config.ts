import { parseCSV, type LeaderboardItem } from '../types'

export type Submission = {
    id: string
    nickname: string
    qq: string
    group: string
    score1: number
    score2: number
    score3: number
    scoreAll: number
    timeLastTrack: string
}

function toFullWidth(value: string): string {
    return value.replace(/[!-~]/g, char =>
        String.fromCharCode(char.charCodeAt(0) + 0xfee0),
    )
}

function parseTrackTime(value: string): number {
    const match = value.match(
        /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/,
    )
    if (!match) return Number.POSITIVE_INFINITY

    const [, year, month, day, hour, minute] = match
    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
    ).getTime()
}

export function parseWMCCSV(csv: string): Submission[] {
    return parseCSV(csv, row => ({
        id: toFullWidth(row.get('ID') ?? ''),
        nickname: row.get('nickname') ?? '',
        qq: row.get('qq') ?? '',
        group: row.get('group') ?? '',
        score1: parseFloat(row.get('score1') ?? '0'),
        score2: parseFloat(row.get('score2') ?? '0'),
        score3: parseFloat(row.get('score3') ?? '0'),
        scoreAll: parseFloat(row.get('score_all') ?? '0'),
        timeLastTrack: row.get('time_last_track') ?? '',
    }))
}

export function toLeaderboard(
    submissions: Submission[],
    topN?: number,
): LeaderboardItem[] {
    const highlightLimit = topN ?? 8
    const sorted = [...submissions].sort((a, b) => {
        if (b.scoreAll !== a.scoreAll) return b.scoreAll - a.scoreAll
        return parseTrackTime(a.timeLastTrack) - parseTrackTime(b.timeLastTrack)
    })

    return sorted.map((submission, index) => ({
        name: submission.id,
        score: `${submission.scoreAll.toFixed(4)}%`,
        highlighted: index < highlightLimit,
    }))
}

export default {
    slug: 'wmc-2nd',
    title: 'WMC 2nd',
    groups: ['A', 'B'] as const,
    groupNames: {
        A: '公开组',
        B: '新人组',
    },
    groupShortNames: {
        A: 'A',
        B: 'B',
    },
}
