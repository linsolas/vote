'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * FIREBASE CONNECTION
 * Utils class to connect and interact with the Firebase database.
 *   - `api-key`: API key for the Firebase database.
 *   - `auth-domain`: Auth domain for the Firebase database.
 *   - `database-url`: Database URL.
 *   - `storage-bucket`: Storage bucket for the Firebase database.
 **/
var FirebaseUtils = function () {
  function FirebaseUtils() {
    _classCallCheck(this, FirebaseUtils);
  }

  _createClass(FirebaseUtils, [{
    key: 'beforeRegister',
    value: function beforeRegister() {
      this.properties = {
        apiKey: String,
        authDomain: String,
        databaseUrl: String,
        storageBucket: String
      };
    }

    // Initialize the connection to the Firebase database.

  }, {
    key: 'ready',
    value: function ready() {
      if (!this.isInitialized()) {
        var config = {
          apiKey: this.apiKey,
          authDomain: this.authDomain,
          databaseURL: this.databaseUrl,
          storageBucket: this.storageBucket
        };
        firebase.initializeApp(config); //, 'GBISLab');
        this.authenticate();
      }
      // TODO Best way to do it?
      if (!window.firebaseUtils) {
        window.firebaseUtils = this;
      }
    }

    /**
     * Check if the Firebase database is already initialized or not.
     * @return a boolean indicating if the Firebase connection has already been initialized.
     */

  }, {
    key: 'isInitialized',
    value: function isInitialized() {
      return firebase.apps.length > 0;
    }

    /**
     * Convert an object to array.
     * @param  object Object to convert to an array
     * @return an array containing the keys of the object given as parameter.
     */

  }, {
    key: 'objectToArray',
    value: function objectToArray(object) {
      var newObject = void 0;
      if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
        return Object.keys(object).map(function (key) {
          newObject = object[key];
          newObject.id = key;
          return newObject;
        });
      }
      return object ? [object] : [];
    }

    /**
     * Retrieve the campaign key from the code (juryCode or voteCode).
     * The way it is stored in `/configuration` is:
     * ```
     * {
     *   "-KUH2q2k22qjvjMgy9PF": {
     *     "juryCode": "4278",
     *     "voteCode": "2391"
     *   }
     * }
     * ```
     * and we need to retrieve the `-KUH2q2k22qjvjMgy9PF` key.
     * @param  code   Code of 4 digits for the campaign, filled by the user.
     * @param  config Configuration of the campaign.
     * @return an object with the campaign `key` and a flag to indicates if this is a jury code, or `null` if not found.
     */

  }, {
    key: '_retrieveCampaignKey',
    value: function _retrieveCampaignKey(code, config) {
      for (var key in config) {
        if (config[key].voteCode === code) {
          return {
            key: key,
            jury: false
          };
        } else if (config[key].juryCode === code) {
          return {
            key: key,
            jury: true
          };
        }
      }
      return null;
    }

    /**
     * Retrieve a campaign configuration from its ID.
     * @param campaignId ID of the campaign.
     * @param callback   Callback.
     */

  }, {
    key: 'getCampaignConfig',
    value: function getCampaignConfig(campaignId, callback) {
      var _this = this;

      var campaignRef = firebase.database().ref('configuration');
      campaignRef.once('value', function (config) {
        var key = _this._retrieveCampaignKey(campaignId, config.val());
        if (key === null) {
          // Campaign not found!
          callback(null);
        } else {
          firebase.database().ref('sessions/session-' + key.key + '/config').once('value', function (data) {
            var campaignConfig = data.val();
            if (campaignConfig !== null) {
              campaignConfig.campaignKey = key.key;
              campaignConfig.jury = key.jury;
            }
            callback(campaignConfig);
          });
        }
      });
    }

    /**
     * Retrieve the campaign ideas.
     * @param campaignId ID of the campaign.
     * @param callback   Callback.
     */

  }, {
    key: 'getCampaignIdeas',
    value: function getCampaignIdeas(campaignId, callback) {
      var _this2 = this;

      var ideasRef = firebase.database().ref('sessions/session-' + campaignId + '/ideas');
      ideasRef.on('value', function (data) {
        var arrayOfIdeas = _this2.objectToArray(data.val());
        callback(arrayOfIdeas);
      });
    }

    /**
     * Retrieve the campaign votes.
     * @param campaignId ID of the campaign.
     * @param callback   Callback.
     */

  }, {
    key: 'getCampaignVotes',
    value: function getCampaignVotes(campaignId, callback) {
      var _this3 = this;

      var votesRef = firebase.database().ref('sessions/session-' + campaignId + '/votes');
      votesRef.on('value', function (data) {
        var arrayOfVotes = _this3.objectToArray(data.val());
        callback(arrayOfVotes);
      });
    }

    /**
     * Vote for ideas.
     * @param campaignId    ID of the campaign.
     * @param isJury        Is the user a jury?
     * @param selectedIdeas Array of selection (3 elements, one item per vote).
     * @param metadata      Metadata of the user (IP, country information).
     * @param callback      Callback called when the vote has been submitted on Firebase.
     **/

  }, {
    key: 'voteForIdeas',
    value: function voteForIdeas(campaignId, isJury, selectedIdeas, metadata, callback) {
      var ref = 'sessions/session-' + campaignId + '/votes/' + this.uid;
      var data = {
        choices: [],
        jury: isJury,
        date: Date.now(),
        userAgent: navigator.userAgent,
        ip: metadata ? metadata.ip : null,
        country: metadata ? metadata.country : null,
        countryCode: metadata ? metadata.countryCode : null
      };
      for (var i = 0; i < selectedIdeas.length; i++) {
        var idea = selectedIdeas[i];
        if (idea) {
          data.choices.push({
            id: idea.id,
            title: idea.title,
            ranking: i + 1,
            jury: isJury
          });
        }
      }
      firebase.database().ref(ref).set(data, callback);
    }

    /**
     * Authenticate the user.
     */

  }, {
    key: 'authenticate',
    value: function authenticate() {
      var _this4 = this;

      firebase.auth().onAuthStateChanged(function (currentUser) {
        if (currentUser) {
          _this4.user = currentUser;
          _this4.uid = _this4.user.uid;
        } else {
          firebase.auth().signInAnonymously().catch(function (error) {
            console.log('ERROR in sign in anonymously', error);
          });
        }
      });
    }

    /**
     * Retrieve choices made by the user in the past, or `null` if the user never votes before on that campaign.
     * @param campaignId ID of the campaign.
     * @param callback   Callback.
     */

  }, {
    key: 'retrieveUserChoices',
    value: function retrieveUserChoices(campaignId, callback) {
      var userVoteRef = firebase.database().ref('sessions/session-' + campaignId + '/votes/' + this.uid);
      userVoteRef.on('value', function (data) {
        callback(data.val());
      });
    }
  }]);

  return FirebaseUtils;
}();

// Create Polymer component


Polymer(FirebaseUtils); // eslint-disable-line
