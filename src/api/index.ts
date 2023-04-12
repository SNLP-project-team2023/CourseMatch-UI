// import { Configuration } from "../generated/client";

import Config from "app/config";
import { Configuration, ConfigurationParameters, MatchApi } from "generated/client";

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
    basePath: string,
    accessToken?: string
  ) => () => (
    new Constructor({
      basePath: basePath,
      accessToken: accessToken
    })
  );

  /**
   * Returns API client
   *
   * @param accessToken access token
   */
  export const getApiClient = (accessToken?: string) => {
    const getConfiguration = getConfigurationFactory(
      Configuration,
      Config.get().api.baseUrl,
      accessToken
    );

    return {
      draftsApi: new MatchApi(getConfiguration()),
    };
  };

}

export default Api;