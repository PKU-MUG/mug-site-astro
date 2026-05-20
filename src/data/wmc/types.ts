/**
 * WMC 通用 CSV 解析工具
 */

export function parseCSV<T>(
    csv: string,
    parser: (row: Map<string, string>) => T,
): T[] {
    const lines = csv.split('\n')
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim().replace(/\r/g, ''))
    const results: T[] = []

    for (const line of lines.slice(1)) {
        if (!line.trim()) continue
        const values = line.split(',')
        const row = new Map<string, string>()
        headers.forEach((header, i) => {
            row.set(header, values[i]?.trim().replace(/\r/g, '') ?? '')
        })
        results.push(parser(row))
    }

    return results
}

export type LeaderboardItem = {
    name: string
    score: string
    highlighted: boolean
}

export function processLeaderboard<T>(
    items: T[],
    getScore: (item: T) => number,
    getName: (item: T) => string,
    topN: number = 8,
): LeaderboardItem[] {
    const sorted = [...items].sort((a, b) => getScore(b) - getScore(a))
    return sorted.map((item, index) => ({
        name: getName(item),
        score: `${getScore(item).toFixed(4)}%`,
        highlighted: index < topN,
    }))
}
