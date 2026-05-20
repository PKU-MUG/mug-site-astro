import { parseCSV, type LeaderboardItem, processLeaderboard } from '../types'

export type Submission = {
    id: string
    nickname: string
    qq: string
    group: string
    score1: number
    score2: number
    score3: number
    scoreAll: number
}

export function parseWMCCSV(csv: string): Submission[] {
    return parseCSV(csv, row => ({
        id: row.get('ID') ?? '',
        nickname: row.get('nickname') ?? '',
        qq: row.get('qq') ?? '',
        group: row.get('group') ?? '',
        score1: parseFloat(row.get('score1') ?? '0'),
        score2: parseFloat(row.get('score2') ?? '0'),
        score3: parseFloat(row.get('score3') ?? '0'),
        scoreAll: parseFloat(row.get('score_all') ?? '0'),
    }))
}

export function toLeaderboard(
    submissions: Submission[],
    topN?: number,
): LeaderboardItem[] {
    return processLeaderboard(
        submissions,
        s => s.scoreAll,
        s => s.id,
        topN,
    )
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
