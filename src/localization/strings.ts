import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";
import en from "./en.json";
import fi from "./fi.json";

/**
 * Localized strings
 */
export interface Localized extends LocalizedStringsMethods {
// TODO Finnish localization

  /**
   * Translations related to generic words
   */
  generic: {
    cancel: string;
    delete: string;
    edit: string;
    logout: string;
    notImplemented: string;
    save: string;
  };

  /**
   * Translations related to error handling
   */
  errorHandling: {
    title: string;
    match: {
      fetch: string;
    },
    course: {
      fetch: string;
    }
  };

  /**
   * Translations related to header
   */
  header: {
    icon: string;
    title: string
    infoText: string
    languages: {
      fi: string
      en: string
    }
  }

  /**
   * Translations related to course
   */
  course: {
    credits: string;
    period: string;
    language: string;
    description: string;
    goToMycourses: string;
    goToSisu: string;
    moreInfo: string;
  }

  /**
   * Translations related to main screen
   */
  mainScreen: {
    searchMode: {
      code: string;
      text: string;
    }
    moreOptions: string;
    courseCode: string;
    courseQueryText: string;
    matchYourCourses: string;
  }
}

/**
 * Initialized localized strings
 */
const strings: Localized = new LocalizedStrings({ en: en, fi: fi });

export default strings;