'use strict';

/*
 * OK, I know that's tout pourri, but I don't need any kind of framework (such as `format.js`) just to translate 10
 * messages, so I do it directly...
 *
 * The good way (and Polymer-way) to go is to use `PolymerElements/app-localize-behavior`.
 * https://www.polymer-project.org/1.0/toolbox/localize
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GBISLabLocalizer = function () {
  _createClass(GBISLabLocalizer, null, [{
    key: 'getTranslations',
    value: function getTranslations() {
      return {
        en: {
          pinCode: {
            voteTitle: 'To be allowed to vote, please enter the code for the session:',
            resultsTitle: 'To see the final vote results, please enter the code for the session:',
            notFound: 'The session has not been found.',
            closed: 'The session is now closed. You cannot vote anymore.',
            tryAgain: 'Please re-enter the session code.'
          },
          vote: {
            welcomeJury: 'Welcome, jury member.',
            choseIdeas: 'Select the three ideas below that you believe show the most promise. Rank them in order of importance: Gold, Silver and Bronze.',
            submit: 'Submit your votes',
            submitted: {
              title: 'Vote submitted',
              text: 'All the votes are now being collected. As soon as all the votes are collected, you will be able to see who has won.'
            }
          },
          results: {
            title: 'Final results',
            total: 'Total points',
            points: 'points',
            jury: 'Jury',
            publik: 'Public',
            ranks: ['st', 'nd', 'rd', 'th']
          }
        },
        fr: {
          pinCode: {
            voteTitle: 'Avant de pouvoir voter, merci de renseigner le code de la session :',
            resultsTitle: 'Afin de connaître les résultats du vote, merci de renseigner le code de la session :',
            notFound: 'La session n\'a pu être trouvée.',
            closed: 'La session est close, vous ne pouvez plus voter.',
            tryAgain: 'Merci d\'entrer à nouveau le code de session.'
          },
          vote: {
            welcomeJury: 'Bienvenue, membre du jury.',
            choseIdeas: 'Selectionnez les trois idées ci-dessous qui vous paraissent les plus prometteuses. Classez-les par ordre d\'importance: Or, Argent et Bronze.',
            submit: 'Soumettre votre vote',
            submitted: {
              title: 'Vote publié',
              text: 'Nous attendons le reste des votes. Dès que nous aurons reçu l\'ensemble des votes, vous serez en mesure de connaître les gagnants.'
            }
          },
          results: {
            title: 'Résultats finaux',
            total: 'points',
            points: 'points',
            jury: 'Jury',
            publik: 'Public',
            ranks: ['ère', 'nde', 'ème']
          }
        }
      };
    }
  }]);

  function GBISLabLocalizer() {
    _classCallCheck(this, GBISLabLocalizer);

    this.language = window.navigator && window.navigator.language;
    if (this.language !== 'fr') {
      this.language = 'en';
    }
    this.translations = GBISLabLocalizer.getTranslations()[this.language];
  }

  _createClass(GBISLabLocalizer, [{
    key: 'localize',
    value: function localize(messageKey) {
      if (!messageKey) {
        return '';
      }
      var keys = messageKey.split('.');
      var object = this.translations[keys[0]];
      var index = 1;
      while (object !== null && index < keys.length) {
        object = object[keys[index++]];
      }
      return object;
    }
  }]);

  return GBISLabLocalizer;
}();

window.GBISLabLocalizer = new GBISLabLocalizer();