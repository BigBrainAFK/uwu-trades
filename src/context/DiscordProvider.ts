import { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";
import { DiscordProfile } from "next-auth/providers/discord";

// This is a copy of the source code for the DiscordProvider class from the next-auth/providers/discord package.
// The only change is that there is no email scope and thus no email field in the profile.
export default function Discord<P extends DiscordProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "discord",
    name: "Discord",
    type: "oauth",
    authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
    token: "https://discord.com/api/oauth2/token",
    userinfo: "https://discord.com/api/users/@me",
    profile(profile) {
      if (profile.avatar === null) {
        const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
        profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
      } else {
        const format = profile.avatar.startsWith("a_") ? "gif" : "png";
        profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
      }
      return {
        id: profile.id,
        name: profile.username,
        image: profile.image_url,
      };
    },
    style: {
      logo: "/discord.svg",
      logoDark: "/discord-dark.svg",
      bg: "#fff",
      text: "#7289DA",
      bgDark: "#7289DA",
      textDark: "#fff",
    },
    options,
  };
}
