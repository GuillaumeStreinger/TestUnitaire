import { DataSource } from "typeorm";

import { Article } from "../Article";
import { Order } from "../Order";
import { ArticleInOrder } from "../ArticleInOrder";

export const getNewDataSource = async () => {
  const dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    entities: [Article, Order, ArticleInOrder],
    synchronize: true,
  });
  await dataSource.initialize();
  return dataSource;
};