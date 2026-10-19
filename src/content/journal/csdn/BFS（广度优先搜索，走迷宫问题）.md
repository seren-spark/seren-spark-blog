---
title: "BFS（广度优先搜索，走迷宫问题）"
description: "用走迷宫问题理解广度优先遍历和队列的使用方式。"
type: journal
occurredAt: 2025-03-16
publishedAt: 2025-03-16
tags:
  - 算法
sourceUrl: https://blog.csdn.net/HBR666_/article/details/146298443
sourceName: CSDN
relatedDocs: []
coverImage: https://i-blog.csdnimg.cn/direct/a2fcf5b74ba34be3b652dfaceb29dda2.png
---

# 前言

马上要蓝桥杯比赛了，最近写算法题总是多多少少会遇到bfs算法，也就是广度优先搜索，基于上学期学的数据结构知识，多多少少也算是知道BFS（广度优先搜索），DFS（深度优先搜索）是个干什么的，那这次就结合算法题来进一步了解一下

# BFS(广度优先搜索)

广度优先搜索的代码可以通过队列实现
从起点开始，一层一层扩撒，先处理完离起点近的，再处理下一层，根据这个特点可知它与队列先进先出的特点相吻合，使用队列保存未被检测的结点，结点按照广度优先的次序被访问和进出队列
同时也非常符合在图上计算最短路径，很多最短路径算法都是由BFS发展而来的

> 它的实现思想是：从一点出发，查出它的邻接节点放入队列并标记，然后从队列中弹出第一个节点，寻找它的邻接未被访问的节点放入队列，直至所有已被访问的节点的邻接点都被访问过；若图中还有未被访问的点，则另选一个未被访问的点出发，执行相同的操作，直至图中所有节点都被访问

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a2fcf5b74ba34be3b652dfaceb29dda2.png)由近到远的访问方式，步骤是：

1. 创建一个队列，并将开始结点放入队列中
2. 若队列非空，则从队列中取出一个结点，检测是否为目标结点
   若是目标结点 则结束搜寻并返回结果
   若不是，则将它所有没有检测过的子节点都加入队列中
3. 若队列为空，表示图中并没有目标节点，则结束遍历
   上图中没有设置目标节点，所以遍历所有节点，先访问节点0，依次访问1 4 2 接着访问节点3 5 最后是786 因此访问顺序是 0 1 4 2 3 5 7 8 6（不唯一）

# 走迷宫问题

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/05642d2c35c94081a82aa97c33d994f2.png)

## 完整代码

```java
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;
// 1:无需package
// 2: 类名必须Main, 不可修改

public class Main {
     public static void main(String[] args) {
		 Scanner scan = new Scanner(System.in);
		 int n=scan.nextInt();
		 int m=scan.nextInt();
		 int arr[][]=new int[n][m];//一个n*m矩阵
		 boolean visited[][]=new boolean[n][m]; //记录是否被访问过
		 for(int i=0;i<n;i++) {
			 for(int j=0;j<m;j++) {
				 arr[i][j]=scan.nextInt();
			 }
		 }  //为矩阵赋值
		 int []start=new int[2]; //记录开始位置
		 start[0]=scan.nextInt()-1; //输入的值与索引值是相差1
		 start[1]=scan.nextInt()-1;
		 //记录终点位置
		 int p=scan.nextInt()-1;
		 int q=scan.nextInt()-1;
		 //调用bfs函数
		 int steps=bfs(arr,visited,start,p,q);
		 System.out.println(steps);
		 scan.close();
	    }

	private static int bfs(int[][] arr, boolean[][] visited, int[] start, int p, int q) {
		Queue<int []> queue=new LinkedList<>();
		queue.offer(start);
		int step=0;

		while(!queue.isEmpty()) {
	int size=queue.size();
			for(int i=0;i<size;i++) {
				int [] position=queue.poll();
				int x=position[0];
				int y=position[1];
				if(x==p&&y==q) {
					return step;
				}
				int [] dx= {1,0,0,-1};
				int [] dy= {0,1,-1,0};
				for(int j=0;j<dy.length;j++) {
					int x1=dx[j]+x;
					int y1=dy[j]+y;
					if(x1<0||y1<0||x1>=arr.length||y1>=arr[0].length||visited[x1][y1]||arr[x1][y1]==0) {
						continue;
					}
					queue.offer(new int[] {x1,y1});
					visited[x1][y1]=true;
				}


			}
			step++;
		}
		return -1;
	}
}
```

## bfs函数讲解

```java
private static int bfs(int[][] arr, boolean[][] visited, int[] start, int p, int q) {
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(start);
    int step = 0;
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            int[] position = queue.poll();
            int x = position[0];
            int y = position[1];
            if (x == p && y == q) {
                return step;
            }
            int[] dx = {1, 0, 0, -1};
            int[] dy = {0, 1, -1, 0};
            for (int j = 0; j < dy.length; j++) {
                int x1 = dx[j] + x;
                int y1 = dy[j] + y;
                // 修改判断条件，避免数组越界
                if (x1 < 0 || y1 < 0 || x1 >= arr.length || y1 >= arr[0].length || visited[x1][y1] || arr[x1][y1] == 0) {
                    continue;
                }
                queue.offer(new int[]{x1, y1});
                visited[x1][y1] = true;
            }
        }
        step++;
    }
    return -1;
}
```

1.  创建一个队列 queue （是一个int数组类型），用于存储访问的位置
2.  `queue.offer（start）` 将起点加入队列
3.  初始化step为0
4.  当队列不为空时 遍历当前队列所有位置
5.  `int[] position = queue.poll();` 从队列中取出一个位置（根据队列的先进先出的性质 取出的肯定是最先进去的）
6.  获取该位置的坐标 x y
7.  如果当前位置是目标点 则直接返回
8.  定义四个方向的偏移量 分别表示 右 下 上 左
9.  内层嵌套的for循环用于遍历 取出位置（x，y）的四个方向
10. 进行判断 如果数组越界或者位置已经遍历过或者为障碍物 则直接跳过此次循环 不执行下面操作了
11. 将可走方向的坐标位置放入队列 `queue.offer(new int[]{x1, y1});`
12. 当前遍历结束后 步数加一

# queue.add和queue.offer

add和offer 都是往队列的尾部插入元素 但是add和offer之间存在一些差异
**异常处理：**
add() 方法在插入元素失败时（例如队列已满），会抛出 IllegalStateException 异常。
offer() 方法在插入元素失败时，会返回 false，而不会抛出异常。
**使用场景：**
当队列有容量限制（如 ArrayBlockingQueue）时，使用 offer() 方法更为合适，因为它能避免异常的抛出。
当确定队列不会满时，使用 add() 方法会让代码更加简洁。

# 总结

广度优先搜索常常用于最短路径问题 ，广度优先搜索大眼一看总感觉很难 但是只要知道核心思想再一步步实现出来感觉还行

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/146298443)
