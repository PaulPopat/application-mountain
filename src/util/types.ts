import {
  IsObject,
  IsNumber,
  IsString,
  IsDictionary,
  Optional,
  IsDiscriminated,
  IsBoolean,
  IsLiteral,
  IsArray,
  IsType,
  IsUnion,
  DoNotCare
} from "./type";

export const IsSharedConfig = IsObject({
  UserLocalConfigStore: IsObject({
    Software: IsObject({
      valve: IsObject({
        Steam: IsObject({
          SSAVersion: IsNumber,
          DesktopShortcutCheck: IsNumber,
          StartMenuShortcutCheck: IsNumber,
          AutoLaunchGameListCheck: IsNumber,
          SteamDefaultDialog: IsString,
          Apps: IsDictionary(
            IsObject({
              tags: Optional(IsDictionary(IsString)),
              LastPlayed: Optional(IsString),
              CloudEnabled: Optional(IsNumber)
            })
          ),
          PrivacyPolicyVersion: IsNumber,
          SurveyDate: IsString,
          SurveyDateVersion: IsNumber
        })
      })
    }),
    Web: IsDictionary(IsDiscriminated(IsString, IsNumber)),
    TradeInfoHint: IsNumber,
    controller_config: IsDictionary(
      IsObject({
        usetime: IsNumber,
        selected: Optional(IsString)
      })
    )
  })
});

export type SharedConfig = IsType<typeof IsSharedConfig>;

export const IsGameInfo = IsDictionary(
  IsObject({
    success: IsBoolean,
    data: Optional(
      IsObject({
        type: IsString,
        name: IsString,
        steam_appid: IsNumber,
        required_age: IsDiscriminated(IsString, IsNumber),
        is_free: IsBoolean,
        controller_support: Optional(IsDiscriminated(IsLiteral("full"))),
        dlc: Optional(IsArray(IsNumber)),
        detailed_description: IsString,
        about_the_game: IsString,
        short_description: IsString,
        supported_languages: IsString,
        header_image: IsString,
        website: Optional(IsString),
        pc_requirements: IsDiscriminated(
          IsObject({
            minimum: Optional(IsString),
            recomended: Optional(IsString)
          }),
          IsArray(IsString)
        ),
        mac_requirements: IsDiscriminated(
          IsObject({
            minimum: Optional(IsString),
            recomended: Optional(IsString)
          }),
          IsArray(IsString)
        ),
        linux_requirements: IsDiscriminated(
          IsObject({
            minimum: Optional(IsString),
            recomended: Optional(IsString)
          }),
          IsArray(IsString)
        ),
        legal_notice: Optional(IsString),
        developers: IsArray(IsString),
        publishers: IsArray(IsString),
        demos: Optional(
          IsArray(IsObject({ appid: IsNumber, description: IsString }))
        ),
        price_overview: Optional(
          IsObject({
            currency: IsDiscriminated(IsLiteral("GBP")),
            initial: IsNumber,
            final: IsNumber,
            discount_percent: IsNumber,
            initial_formatted: IsString,
            final_formatted: IsString
          })
        ),
        packages: Optional(IsArray(IsNumber)),
        package_groups: IsArray(
          IsObject({
            name: IsString,
            title: IsString,
            description: IsString,
            selection_text: IsString,
            save_text: IsString,
            display_type: IsNumber,
            is_recurring_subscription: IsString,
            subs: IsArray(
              IsObject({
                packageid: IsNumber,
                percent_savings_text: IsString,
                percent_savings: IsNumber,
                option_text: IsString,
                option_description: IsString,
                can_get_free_license: IsString,
                is_free_license: IsBoolean,
                price_in_cents_with_discount: IsNumber
              })
            )
          })
        ),
        platforms: IsObject({
          windows: IsBoolean,
          mac: IsBoolean,
          linux: IsBoolean
        }),
        metacritic: IsObject({ score: IsNumber, url: IsString }),
        categories: Optional(
          IsArray(IsObject({ id: IsNumber, description: IsString }))
        ),
        genres: Optional(
          IsArray(IsObject({ id: IsNumber, description: IsString }))
        ),
        screenshots: IsArray(
          IsObject({
            id: IsNumber,
            path_thumbnail: IsString,
            path_full: IsString
          })
        ),
        movies: Optional(
          IsArray(
            IsObject({
              id: IsNumber,
              name: IsString,
              thumbnail: IsString,
              webm: IsObject({
                480: IsString,
                max: IsString
              }),
              highlight: IsBoolean
            })
          )
        ),
        recommendations: Optional(IsObject({ total: IsNumber })),
        achievements: Optional(
          IsObject({
            total: IsNumber,
            highlighted: IsArray(IsObject({ name: IsString, path: IsString }))
          })
        ),
        release_date: IsObject({ coming_soon: IsBoolean, date: IsString }),
        support_info: IsObject({ url: IsString, email: IsString }),
        background: IsString,
        content_descriptors: IsObject({
          ids: IsArray(IsNumber),
          nodes: Optional(IsString)
        })
      })
    )
  })
);

export type GameInfo = IsType<typeof IsGameInfo>;

export const IsAppList = IsArray(IsObject({ appid: IsNumber, name: IsString }));

export type AppList = IsType<typeof IsAppList>;

export const IsSteamLibrary = IsObject({
  applist: IsObject({
    apps: IsAppList
  })
});

export type SteamLibrary = IsType<typeof IsSteamLibrary>;

export const IsTagsList = IsArray(
  IsObject({
    id: IsString,
    name: IsString,
    apps: IsArray(IsNumber)
  })
);

export type TagsList = IsType<typeof IsTagsList>;

export const IsLocalConfig = IsObject({
  UserLocalConfigStore: IsObject({
    streaming_v2: DoNotCare,
    Broadcast: DoNotCare,
    friends: DoNotCare,
    apptickets: DoNotCare,
    Offline: DoNotCare,
    ParentalSettings: DoNotCare,
    AppInfoChangeNumber: DoNotCare,
    CloudKey: DoNotCare,
    CloudKeyCRC: DoNotCare,
    Software: IsObject({
      valve: IsObject({
        Steam: IsObject({
          Apps: IsDictionary(
            IsObject({
              LastPlayed: IsNumber,
              ViewedLaunchEULA: Optional(IsNumber),
              BadgeData: Optional(IsString),
              LaunchOptions: Optional(IsString),
              DisableUpdatesUntil: Optional(IsString)
            })
          ),
          LastPlayedTimesSyncTime: DoNotCare,
          PlayerLevel: DoNotCare,
          SSAVersion: DoNotCare,
          ShaderCacheManager: DoNotCare
        })
      })
    }),
    HideSharingNotifications: DoNotCare,
    system: DoNotCare,
    News: DoNotCare,
    LastInstallFolderIndex: DoNotCare,
    depots: DoNotCare,
    SkipLastInstallPage: DoNotCare,
    "StartupState.Friends": DoNotCare,
    controller_registration: DoNotCare,
    controller_config: DoNotCare,
    BigPicture: DoNotCare,
    nettickets: DoNotCare,
    Apps: DoNotCare,
    SharedAuth: DoNotCare,
    streaming: DoNotCare,
    bigpictureweb: DoNotCare,
    WebStorage: DoNotCare,
    cache: DoNotCare,
    UserAppConfig: DoNotCare,
    SteamController_DisableTwoFootNotifications: DoNotCare,
    ControllerTypesUsed: DoNotCare,
    Licenses: DoNotCare
  })
});

export type LocalConfig = IsType<typeof IsLocalConfig>;
