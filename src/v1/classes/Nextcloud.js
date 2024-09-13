const axios = require("axios");
const { Base64 } = require("js-base64");

class Nextcloud {
  constructor() {
    this.url = `${process.env.NEXTCLOUD_URL}/ocs/v2.php/apps/files_sharing/api/v1/shares`;
    this.user = process.env.NEXTCLOUD_USER;
    this.pass = process.env.NEXTCLOUD_PASS;
  }

  shareLink = async (path) => {
    try {
      const response = await axios.post(
        this.url,
        new URLSearchParams({
          path,
          shareType: 3,
          permissions: 1,
        }),
        {
          headers: {
            "OCS-APIRequest": true,
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " + Base64.encode(`${this.user}:${this.pass}`),
          },
        }
      );

      const shareLink = response.data.ocs.data.url;
      return shareLink;
    } catch (error) {
      return error;
    }
  };
}

module.exports = Nextcloud;
