import {
  IsObject,
  IsNumber,
  IsString,
  IsDictionary,
  Optional,
  IsUnion,
  IsBoolean,
  IsLiteral,
  IsArray,
  IsType
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
    Web: IsDictionary(IsUnion(IsString, IsNumber)),
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
        required_age: IsUnion(IsString, IsNumber),
        is_free: IsBoolean,
        controller_support: Optional(IsUnion(IsLiteral("full"))),
        dlc: Optional(IsArray(IsNumber)),
        detailed_description: IsString,
        about_the_game: IsString,
        short_description: IsString,
        supported_languages: IsString,
        header_image: IsString,
        website: Optional(IsString),
        pc_requirements: IsUnion(
          IsObject({
            minimum: Optional(IsString),
            recomended: Optional(IsString)
          }),
          IsArray(IsString)
        ),
        mac_requirements: IsUnion(
          IsObject({
            minimum: Optional(IsString),
            recomended: Optional(IsString)
          }),
          IsArray(IsString)
        ),
        linux_requirements: IsUnion(
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
            currency: IsUnion(IsLiteral("GBP")),
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
        categories: IsArray(IsObject({ id: IsNumber, description: IsString })),
        genres: IsArray(IsObject({ id: IsNumber, description: IsString })),
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