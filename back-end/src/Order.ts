import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from "typeorm";
  
  import { sendEmail } from "./lib/email";
  import { Article } from "./Article";
  import { ArticleInOrder } from "./ArticleInOrder";
  
  @Entity()
  export class Order extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @OneToMany(() => ArticleInOrder, (articleInOrder) => articleInOrder.order, {
      eager: true,
    })
    articlesInOrder!: ArticleInOrder[];
  
    @Column({ default: false })
    submitted!: boolean;
    date!: Date;
  
    static async createOrder(
      articlesInOrder: { articleId: string; quantity: number }[]
    ): Promise<Order> {
      for (const { articleId } of articlesInOrder) {
        const article = await Article.findOne({ where: { id: articleId } });
        if (!article) {
          throw new Error(`Article with ID ${articleId} not found.`);
        }
      }
  
      const order = Order.create();
      await order.save();
  
      for (const { articleId, quantity } of articlesInOrder) {
        const article = await Article.findOneOrFail({ where: { id: articleId } });
        const articleInOrder = ArticleInOrder.create();
        articleInOrder.order = order;
        articleInOrder.article = article;
        articleInOrder.quantity = quantity;
        await articleInOrder.save();
      }
  
      await order.reload();
      return order;
    }
  
    async submitOrder() {
      this.submitted = true;
      await this.save();
      sendEmail();
    }
  
    private getTotalPrice(): number {
      return this.articlesInOrder.reduce(
        (total, { article, quantity }) => total + article.priceEur * quantity,
        0
      );
    }
  
    getShippingCost(): number {
      return this.getTotalPrice() >= 100
        ? 0
        : this.articlesInOrder.reduce(
            (total, { article, quantity }) =>
              total +
              (article.specialShippingCost || article.weightKg * 10) * quantity,
            0
          );
    }
  
    getOrderCost(): {
      totalWithoutShipping: number;
      shipping: number;
      totalWithShipping: number;
    } {
      const totalWithoutShipping = this.getTotalPrice();
      const shipping = this.getShippingCost();
  
      return {
        totalWithoutShipping,
        shipping,
        totalWithShipping: totalWithoutShipping + shipping,
      };
    }
  
    async deleteOrder() {
      await Order.delete({ id: this.id });
    }

    static async getOrderStatistics(): Promise<Record<string, number>> {
      const orders = await this.find({ relations: ["articlesInOrder", "articlesInOrder.article"] });
      return orders.reduce((acc, order) => {
        const month = `${order.date.getFullYear()}-${order.date.getMonth() + 1}`;
        const totalPrice = order.articlesInOrder.reduce((total, { article, quantity }) => total + article.priceEur * quantity, 0);
        acc[month] = (acc[month] || 0) + totalPrice;
        return acc;
      }, {} as Record<string, number>);
    }

    async getOrderDetails() {
      return {
        dateCreated: this.date,
        articles: this.articlesInOrder.map(a => ({
          name: a.article.name,
          price: a.article.priceEur,
          quantity: a.quantity,
        })),
        totalWithoutShipping: this.getTotalPrice(),
        shippingCost: this.getShippingCost(),
        totalWithShipping: this.getTotalPrice() + this.getShippingCost(),
        submitted: this.submitted,
      };
    }
  }