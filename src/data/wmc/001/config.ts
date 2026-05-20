import { parseCSV, type LeaderboardItem, processLeaderboard } from '../types'

export type Submission = {
    id: number
    submitTime: Date
    gameId: string
    qq: string
    group: string
    score: number
}

const toFullWidth = (str: string): string => {
    return str.replace(/[!-~]/g, char => {
        const code = char.charCodeAt(0)
        return String.fromCharCode(code + 0xfee0)
    })
}

export function parseWMCCSV(csv: string): Submission[] {
    return parseCSV(csv, row => ({
        id: parseInt(row.get('序号') ?? '0'),
        submitTime: new Date(row.get('提交答卷时间') ?? ''),
        gameId: toFullWidth(
            row.get('1、您的游戏ID（请从舞萌DX公众号原样复制）') ?? '',
        ),
        qq: row.get('2、您的QQ帐号') ?? '',
        group: row.get('3、参与组别') ?? '',
        score: parseFloat((row.get('8、成绩') ?? '0').replace('%', '')),
    }))
}

export function dedupeByLastSubmission(
    submissions: Submission[],
): Submission[] {
    const grouped = new Map<string, Submission[]>()
    for (const s of submissions) {
        const key = `${s.qq}-${s.group}`
        if (!grouped.has(key)) grouped.set(key, [])
        grouped.get(key)?.push(s)
    }
    return Array.from(grouped.values()).map(group =>
        group.reduce((prev, curr) =>
            prev.submitTime > curr.submitTime ? prev : curr,
        ),
    )
}

export function toLeaderboard(
    submissions: Submission[],
    topN?: number,
): LeaderboardItem[] {
    return processLeaderboard(
        submissions,
        s => s.score,
        s => s.gameId,
        topN,
    )
}

export default {
    slug: 'wmc-1st',
    title: 'WMC 1st',
    groups: ['A', 'B', 'C'] as const,
    groupNames: {
        A: '高难组（A 组）',
        B: '娱乐组（B 组）',
        C: '萌新组（C 组）',
    },
    groupShortNames: {
        A: 'A 组',
        B: 'B 组',
        C: 'C 组',
    },
}
