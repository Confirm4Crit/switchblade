const SearchCommand = require('../../../structures/command/SearchCommand.js')
const { SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class SpotifyTrack extends SearchCommand {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'spotify')
    this.name = 'track'
    this.aliases = ['song', 't']
    this.embedColor = Constants.SPOTIFY_COLOR
    this.embedLogoURL = 'https://i.imgur.com/vw8svty.png'
  }

  async search (context, query) {
    return this.client.apis.spotify.searchTracks(query, 10)
  }

  searchResultFormatter (item) {
    return `[${item.name}](${item.external_urls.spotify}) - [${item.artists[0].name}](${item.artists[0].external_urls.spotify})`
  }

  async handleResult ({ t, channel, author, language }, { id }) {
    const { album, artists, name, duration_ms: duration, explicit, external_urls: urls } = await this.client.apis.spotify.getTrack(id)
    const [ cover ] = album.images.sort((a, b) => b.width - a.width)
    const artistTitle = artists.length > 1 ? t('commands:spotify.artistPlural') : t('commands:spotify.artist')
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:spotify.subcommands.track.trackInfo'), this.embedLogoURL, urls.spotify)
      .setDescription(`${explicit ? `${Constants.EXPLICIT} ` : ' '}[${name}](${urls.spotify}) \`(${MiscUtils.formatDuration(duration)})\``)
      .setThumbnail(cover.url)
      .addField(t('commands:spotify.album'), `[${album.name}](${album.external_urls.spotify}) \`(${album.release_date.split('-')[0]})\``, true)
      .addField(artistTitle, artists.map(a => `[${a.name}](${a.external_urls.spotify})`).join(', '), true)

    channel.send(embed)
  }
}