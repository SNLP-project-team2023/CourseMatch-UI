// import { Configuration } from "../generated/client";

import Config from "app/config";
import { Configuration, ConfigurationParameters, CourseApi, MatchApi } from "generated/client";

/**
 * Utility class for loading api with predefined configuration
 */
namespace Api {

  /**
   * Returns function to get API client configuration object with given configuration
   *
   * @param Constructor constructable class of configuration for API client
   * @param basePath API base path
   * @param accessToken access token
   */
  const getConfigurationFactory = <T extends {}>(
    Constructor: new(params: ConfigurationParameters) => T,
    basePath: string
  ) => () => (
    new Constructor({
      basePath: basePath
    })
  );

  /**
   * Returns API client
   *
   * @param accessToken access token
   */
  export const getApiClient = () => {
    const getConfiguration = getConfigurationFactory(
      Configuration,
      Config.get().api.baseUrl
    );

    return {
      matchApi: new MatchApi(getConfiguration()),
      courseApi: new CourseApi(getConfiguration())
    };
  };

}

export default Api;