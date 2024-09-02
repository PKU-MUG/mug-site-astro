/// <reference types="mdast" />
import { h } from 'hastscript'

/**
 * Creates a QQ group card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.link - The QQ group link.
 * @param {string} properties.groupid - The QQ group ID.
 * @param {string} properties.title - The QQ group card title.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created QQ group card component.
 */
export function QQCardComponent(properties, children) {
  if (Array.isArray(children) && children.length !== 0)
    return h('div', { class: 'hidden' }, [
      'Invalid directive. ("qqgroup" directive must be leaf type "::qqgroup{link="https://example.com" groupid="123456" title="tester" desc="Desc.."}")',
    ])

  if (!properties.link || !properties.groupid || !properties.title)
    return h(
      'div',
      { class: 'hidden' },
      'Invalid Syntax. ("qqgroup" directive must have "link", "groupid" and "title" attributes)',
    )

  const link = properties.link
  const groupid = properties.groupid
  const title = properties.title
  const desc = properties.desc || ''
  const cardUuid = `QGC${Math.random().toString(36).slice(-6)}` // Collisions are not important

  const nAvatar = h(`div#${cardUuid}-avatar`, { class: 'gc-avatar' })

  const nTitle = h(`div`, { class: 'gc-titlebar' }, [
    h('div', { class: 'qgc-titlebar-left' }, [
      h('div', { class: 'qgc-owner' }, [
        h('div', { class: 'qgc-title' }, title),
      ]),
    ]),
    nAvatar,
  ])

  const nDescription = h(
    `div#${cardUuid}-description`,
    { class: 'qgc-description' },
    desc,
  )
  // Use qoc api

  const nScript = h(
    `script#${cardUuid}-script`,
    { type: 'text/javascript', defer: true },
    `
      (() => {
        const avatarEl = document.getElementById('${cardUuid}-avatar');
        avatarEl.style.backgroundImage = 'url(https://api.qoc.cc/api/quntx?qq=${groupid})';
        avatarEl.style.backgroundColor = 'transparent';
      })();
    `,
  )

  return h(
    `a#${cardUuid}-card`,
    {
      class: 'card-github no-styling',
      href: link,
      target: '_blank',
      groupid,
    },
    [nTitle, nDescription, nScript],
  )
}
