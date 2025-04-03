/**
 * 序号	提交答卷时间	所用时间	来源	来源详情	来自IP	1、您的游戏ID（请从舞萌DX公众号原样复制）	2、您的QQ帐号	3、参与组别	4、请上传 舞萌DX公众号 游玩记录 截图	5、请选择视频提交方式	6、请填写该次游玩手元视频 BV 号	7、请填写网盘提交的视频文件名（请按照：组别-id.后缀 的格式上传和填写，例：B-sjfhsjfh.mp4）	8、审查情况
 */
export type Submission = {
    id: number
    submitTime: string
    usedTime: string
    source: string
    sourceDetail: string
    ip: string
    gameId: string
    qq: string
    group: string
    screenshot: string
    video: readonly ['bilibili', string] | readonly ['disk', string]
    score: number
}

export const parseCSV = (csv: string): Submission[] => {
    const lines = csv.split('\n').slice(1)
    const submissions: Submission[] = []

    for (const line of lines) {
        const columns = line.split(',').map(col => col.trim())
        if (columns.length < 14) continue // Skip invalid lines
        const [
            id,
            submitTime,
            usedTime,
            source,
            sourceDetail,
            ip,
            gameId,
            qq,
            group,
            screenshot,
            _videoMethod,
            videoId,
            fileName,
            score,
        ] = columns
        const video =
            videoId !== ''
                ? (['bilibili', videoId] as const)
                : (['disk', fileName] as const)
        if (score === '') continue
        submissions.push({
            id: parseInt(id),
            submitTime,
            usedTime,
            source,
            sourceDetail,
            ip,
            gameId,
            qq,
            group,
            screenshot,
            video,
            score: parseFloat(score.replace(/%/g, '')),
        })
    }

    // Take max grouping by qq & group
    const grouped = new Map<string, Submission[]>()
    for (const submission of submissions) {
        const key = `${submission.qq}-${submission.group}`
        if (!grouped.has(key)) {
            grouped.set(key, [])
        }
        grouped.get(key)?.push(submission)
    }

    const result: Submission[] = []
    for (const [key, group] of grouped.entries()) {
        const maxSubmission = group.reduce((prev, curr) =>
            prev.score > curr.score ? prev : curr,
        )
        result.push(maxSubmission)
    }
    return result
}
