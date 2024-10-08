import { useCallback, useContext } from "react";

import * as models from "../models";

import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  EnumTextWeight,
  FlexItem,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import { CodeGeneratorImage } from "../Components/CodeGeneratorImage";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { AppContext } from "../context/appContext";
import DeleteResourceButton from "./DeleteResourceButton";
import ResourceGitRepo from "./ResourceGitRepo";
import ResourceLastBuild from "./ResourceLastBuild";

type Props = {
  resource: models.Resource;
  onDelete?: (resource: models.Resource) => void;
};

function ResourceListItem({ resource }: Props) {
  const { currentWorkspace, currentProject, setResource } =
    useContext(AppContext);
  const { id, name, description } = resource;

  const handleClick = useCallback(() => {
    setResource(resource);
  }, [resource, setResource]);

  return (
    <ListItem
      onClick={handleClick}
      to={`/${currentWorkspace?.id}/${currentProject?.id}/${id}`}
    >
      <FlexItem
        margin={EnumFlexItemMargin.Bottom}
        start={<ResourceCircleBadge type={resource.resourceType} />}
        end={<DeleteResourceButton resource={resource} />}
      >
        <FlexItem direction={EnumFlexDirection.Column} gap={EnumGapSize.Small}>
          <FlexItem
            direction={EnumFlexDirection.Row}
            gap={EnumGapSize.Small}
            itemsAlign={EnumItemsAlign.Center}
          >
            <Text
              textStyle={EnumTextStyle.Normal}
              textWeight={EnumTextWeight.SemiBold}
            >
              {name}
            </Text>

            <CodeGeneratorImage resource={resource} />
          </FlexItem>

          {description && (
            <Text textStyle={EnumTextStyle.Description}>{description}</Text>
          )}
        </FlexItem>
      </FlexItem>
      <FlexItem
        itemsAlign={EnumItemsAlign.Center}
        gap={EnumGapSize.Small}
        margin={EnumFlexItemMargin.None}
        start={<ResourceGitRepo resource={resource} />}
      >
        <ResourceLastBuild resource={resource} />
      </FlexItem>
    </ListItem>
  );
}

export default ResourceListItem;
